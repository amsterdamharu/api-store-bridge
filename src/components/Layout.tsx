import React from 'react';

function Layout({ content: ContentComponent }: any) {
  return (
    <div>
      <ContentComponent />
    </div>
  );
}

export default React.memo(Layout);
