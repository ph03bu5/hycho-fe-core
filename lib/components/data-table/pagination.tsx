import React from 'react';
import { FiRewind, FiChevronLeft, FiChevronRight, FiFastForward } from 'react-icons/fi';

interface PagenationProps {
  currentPage: number;
  totalCount: number;
  rowsPerPage?: number;
  pageHandler?: ((page: number) => void)|undefined;
}

function Pagination({currentPage, totalCount, rowsPerPage = 10, pageHandler}: PagenationProps) {
  const startPage = 1;
  const endPage = Math.ceil(totalCount / rowsPerPage);
  const curPage = Math.max(startPage, Math.min(endPage, currentPage));
  const isStartPage = curPage <= startPage;

  const getBasePage = (p: number) => Math.floor((p - 1) / 5) * 5 + 1;
  const [basePage, setBasePage] = React.useState(getBasePage(curPage));

  const pageMoveHandler = (e: any, pg: number) => {
    e.preventDefault();

    if (curPage !== pg) {
      setBasePage(getBasePage(pg));
      if (pageHandler !== undefined) pageHandler(pg);
    }
  };

  const pagePageHandler = (e: any, delta: number) => {
    e.preventDefault();

    setBasePage(Math.max(startPage, Math.min(getBasePage(endPage), basePage + delta)))
  }

  return totalCount > 0 ? (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        {endPage > 5 && <li className={`page-item page-first ${isStartPage ? 'disabled' : ''}`}> {/*  220501 수정 */}
          <a className="page-link" href="src/components/common/table/pagenation#" aria-label="First" onClick={(e) => pageMoveHandler(e, startPage)}>
            <span aria-hidden="true"><FiRewind /></span> {/*  220501 수정 */}
          </a>
        </li>}
        {endPage > 5 && <li className="page-item page-prev"> {/*  220501 수정 */}
          <a className="page-link" href="src/components/common/table/pagenation#" aria-label="Previous" onClick={(e) => pagePageHandler(e, -5)}>
            <span aria-hidden="true"><FiChevronLeft /></span> {/*  220501 수정 */}
          </a>
        </li>}

        {[0, 1, 2, 3, 4].map(fix => basePage + fix).map(pg => <React.Fragment key={`pg-tick-${pg}`}>{pg >= startPage && endPage >= pg && <li className="page-item"><a className={`page-link ${pg === curPage ? 'active' : ''}`} href="src/components/common/table/pagenation#" onClick={(e) => pageMoveHandler(e, pg)}>{pg}</a></li>}</React.Fragment>)}

        {endPage > 5 && <li className="page-item page-next"> {/*  220501 수정 */}
          <a className="page-link" href="src/components/common/table/pagenation#" aria-label="Next" onClick={(e) => pagePageHandler(e, 5)}>
            <span aria-hidden="true"><FiChevronRight /></span> {/*  220501 수정 */}
          </a>
        </li>}
        {endPage > 5 && <li className="page-item page-last"> {/*  220501 수정 */}
          <a className="page-link" href="src/components/common/table/pagenation#" aria-label="Last" onClick={(e) => pageMoveHandler(e, endPage)}>
            <span aria-hidden="true"><FiFastForward /></span> {/*  220501 수정 */}
          </a>
        </li>}
      </ul>
    </nav>
  ) : null;
}

Pagination.defaultProps = {
  rowsPerPage: 10,
  pageHandler: undefined
};

export default Pagination;