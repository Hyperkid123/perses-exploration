# 🐛 TimeSeriesChart Infinite Loop Bug Report

## 📝 **Bug Description**
The `@perses-dev/timeseries-chart-plugin` has a critical infinite loop bug in the `getTimeSeriesValues` function that causes browser crashes.

## 🚨 **Symptoms**
- Browser tab becomes unresponsive
- Memory usage spikes rapidly
- Error message: "Paused before potential out-of-memory crash"
- Browser eventually crashes or becomes unusable

## 🔍 **Root Cause Analysis**

### **Problematic Code Pattern**
```typescript
export function getTimeSeriesValues(series: TimeSeries, timeScale: TimeScale): TimeSeriesValueTuple[] {
  let timestamp = timeScale.startMs;
  const values = series.values;
  const processedValues: TimeSeriesValueTuple[] = [];

  for (const valueTuple of values) {
    // 🚨 INFINITE LOOP RISK HERE 🚨
    while (timestamp < valueTuple[0]) {
      processedValues.push([timestamp, null]);
      timestamp += timeScale.stepMs;
    }
    // Process actual value...
  }
}
```

### **Why It Happens**
1. **Timestamp Unit Mismatch**: The function expects `valueTuple[0]` in **milliseconds**
2. **Mock Data Issue**: Our mock data had timestamps in **seconds** or wrong time periods
3. **Infinite Condition**: If `valueTuple[0]` < `timestamp`, the while loop never exits
4. **Memory Explosion**: Each loop iteration adds `[timestamp, null]` to array

## 🔧 **Immediate Fix Applied**

### **1. Fixed Mock Data Timestamps**
**Before** (Problematic):
```json
"values": [
  [1760685177.409, "0.033"],  // Year 2025, decimal seconds
  [1760685191.409, "0.032"]   // Wrong time period
]
```

**After** (Fixed):
```json
"values": [
  [1696118400, "25.3"],  // 2023-10-01 00:00:00 in seconds
  [1696118700, "26.1"]   // 2023-10-01 00:05:00 in seconds
]
```

### **2. Proper Time Range Alignment**
- **Component Time Range**: `2023-10-01T00:00:00Z` to `2023-10-01T01:00:00Z`
- **Mock Timestamps**: `1696118400` to `1696122000` (matching the range)
- **Regular Intervals**: 300-second steps (5 minutes)

## ⚠️ **Potential Plugin Bug**

The plugin should have **defensive programming** to prevent infinite loops:

### **Suggested Plugin Fix**
```typescript
export function getTimeSeriesValues(series: TimeSeries, timeScale: TimeScale): TimeSeriesValueTuple[] {
  let timestamp = timeScale.startMs;
  const values = series.values;
  const processedValues: TimeSeriesValueTuple[] = [];

  // 🛡️ ADD SAFETY CHECKS
  const maxIterations = Math.ceil((timeScale.endMs - timeScale.startMs) / timeScale.stepMs) + 100;
  let iterationCount = 0;

  for (const valueTuple of values) {
    // 🛡️ PREVENT INFINITE LOOPS
    while (timestamp < valueTuple[0] && iterationCount < maxIterations) {
      processedValues.push([timestamp, null]);
      timestamp += timeScale.stepMs;
      iterationCount++;
    }

    // 🛡️ SAFETY BREAK
    if (iterationCount >= maxIterations) {
      console.error('TimeSeriesChart: Prevented infinite loop in getTimeSeriesValues', {
        timestamp,
        valueTupleTimestamp: valueTuple[0],
        timeScale,
        seriesLength: values.length
      });
      break;
    }

    // Process actual value...
  }
}
```

## 🎯 **Resolution Status**
- ✅ **Mock data fixed** with proper timestamps
- ✅ **Time range aligned** correctly
- ✅ **New simplified query** created: `cpu_usage{namespace=~".*"}`
- ✅ **Clean test data** with 3 series over 1-hour period
- ❌ **Plugin bug** still exists (needs upstream fix)

## 📋 **Recommendations**

### **For Perses Team**
1. Add infinite loop protection to `getTimeSeriesValues`
2. Add timestamp format validation
3. Improve error messaging for time range mismatches
4. Add unit tests for edge cases

### **For Users**
1. Always ensure mock data timestamps are in **Unix seconds**
2. Verify timestamps fall within the query time range
3. Use regular intervals matching expected step size
4. Test with small datasets first

---
**Bug Discovered**: During Perses dashboard component exploration
**Impact**: Critical - causes browser crashes
**Severity**: High - affects all time series charts with malformed data