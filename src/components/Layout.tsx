import React from 'react';
import { Link } from "react-router-dom";
function Layout({ content: ContentComponent }: any) {
  return (
    <div>
      {/* menu */}
      <ul>
        <li><Link to="/checkout">checkout</Link></li>
        <li><Link to="/">home</Link></li>
      </ul>
      <ContentComponent />
    </div>)
}

export default React.memo(Layout)
