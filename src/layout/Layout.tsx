import { ComponentType, PropsWithChildren } from 'react';
import ReactGridLayout, { Layout as LayoutDef } from 'react-grid-layout';
import useResizeObserver from 'use-resize-observer';

const ItemWrapper = ({ children }: PropsWithChildren) => {
  const { width, ref } = useResizeObserver();
  return (
    <div ref={ref} style={{ position: 'relative', height: '100%' }}>
      <div
        className='custom-drag-handle'
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          zIndex: 1000,
          cursor: 'move',
          background: 'var(--pf-global--primary-color--100)',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          userSelect: 'none',
          border: '1px solid var(--pf-global--primary-color--200)',
        }}
      >
        ⋮⋮ DRAG
      </div>
      <div style={{ width, height: '100%' }}>{children}</div>
    </div>
  );
};

const Layout = ({
  layout,
  onLayoutChange,
}: PropsWithChildren<{
  layout: (LayoutDef & { C: ComponentType })[];
  onLayoutChange: (newLayout: LayoutDef[]) => void;
}>) => {
  const { width, ref } = useResizeObserver();

  const handleLayoutChange = (newLayout: LayoutDef[]) => {
    // Merge the new layout positions with the existing components
    const updatedLayout = newLayout.map((item) => {
      const existingItem = layout.find((l) => l.i === item.i);
      return existingItem ? { ...existingItem, ...item } : item;
    });
    onLayoutChange(updatedLayout as (LayoutDef & { C: ComponentType })[]);
  };

  return (
    <div ref={ref} style={{ minHeight: '100vh' }}>
      <ReactGridLayout
        draggableHandle='.custom-drag-handle'
        preventCollision={false}
        layout={layout}
        cols={12}
        rowHeight={60}
        width={width ?? 1200}
        isDraggable={true}
        isResizable={true}
        margin={[32, 32]}
        onLayoutChange={handleLayoutChange}
      >
        {layout.map(({ C, ...item }) => {
          return (
            <div key={item.i} style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
              <ItemWrapper>
                <C />
              </ItemWrapper>
            </div>
          );
        })}
      </ReactGridLayout>
    </div>
  );
};

export default Layout;
