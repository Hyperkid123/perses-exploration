import '@patternfly/react-core/dist/styles/base.css';
import { Box, ThemeProvider } from '@mui/material';
import { getTheme } from '@perses-dev/components';
import { Grid, GridItem } from '@patternfly/react-core';
import PersesPieChart from './components/PieChartWidget';

const muiTheme = getTheme('light');

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <div>
        <h1>Welcome to Perses Exploration</h1>
      </div>
      <div>
        <Grid hasGutter>
          <GridItem span={6}>
            <Box sx={{ height: '400px', width: '400px' }}>
              <PersesPieChart />
            </Box>
          </GridItem>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default App;
