import React, { ReactNode } from 'react';
import { Form, Table } from 'react-bootstrap';
import { v4 as uuid4 } from 'uuid';
import Pagination from './pagination';

interface ColumnProps {
  title: string;
  field: string;
  width?: string;
  align?: string;
  link?: boolean;
  colGroup?: string;
  check?: boolean;
}

interface DataTableProps {
  columns: ColumnProps[];
  data: any[];
  rowsPerPage?: number;
  rowClickHandler?: ((row: any) => void)|undefined;
  rowCheckHandler?: ((row: any) => void)|undefined;
  rowSelectHandler?: ((row: any) => void)|undefined;
  customHeaderJsx?: ReactNode|undefined;
  noDataText?: string|undefined;
  narrow?: boolean;
  radioType?: boolean;
}

function AnchorsDataTable({columns, data, rowsPerPage = 10, rowClickHandler, rowCheckHandler, rowSelectHandler, customHeaderJsx, noDataText = '데이터가 없습니다.', narrow = false, radioType = false}: DataTableProps) {
  const [selectedRows, setSelectedRows] = React.useState(new Array(data?.length || 100).fill(false));
  const [selectedRow, setSelectedRow] = React.useState<number>();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [uniqueId] = React.useState(uuid4());

  React.useEffect(() => {
    if (data?.length > 0 && data.length !== selectedRows?.length) {
      const rows = [...selectedRows];
      for (let r = selectedRows.length; r < data?.length; r += 1) rows.push(false);
      for (let r = selectedRows.length; r > data?.length; r -= 1) rows.pop();
      setSelectedRows(rows);
    }
  }, [data, selectedRows])

  /*
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data]);
   */

  const firstLineColumns: ColumnProps[] = []; // 단일 컬럼은 그냥 담고, 그룹 컬럼은 제일 첫 하나만 담는 배열
  const columnGroups: {[grpName: string]: ColumnProps[]} = {}; // 그룹 이름으로 구별되는 오브젝트 - 두번째 줄 그리기 위한 배열 (만일 그룹 컬럼이 연속적이지 않을 경우를 대비)
  columns.forEach(c => {
    if (c.colGroup) { // 그룹 선언된 컬럼의 경우
      if (firstLineColumns.filter(cg => cg.colGroup === c.colGroup).length === 0) firstLineColumns.push({...c, title: c.colGroup}); // 제일 첫 하나만 firstLineColumns에 포함
      columnGroups[c.colGroup] = columnGroups[c.colGroup] ? [...columnGroups[c.colGroup], c] : [c]; // 이름으로 구별하는 오브젝트에는 구별 없이 포함
    } else {
      firstLineColumns.push(c); // 그룹 선언되지 않으면 그냥 첫줄에 포함
    }
  });
  const secondLineColumns = firstLineColumns
    .filter(col => !!col.colGroup)  // 첫째줄에서 그룹만 발라내서
    .reduce<ColumnProps[]>((acc, col) => [...acc, ...columnGroups[`${col.colGroup}`]], []);  // 발라낸 그룹을 하나의 배열로 합체

  const checkHandler = (index: number, checked: boolean) => {
    if (index === -1) { // 타이틀 체크박스 클릭일 경우
      setSelectedRows(new Array(data.length).fill(checked));
    } else {  // 개별 항목 체크박스 클릭일 경우
      const nextSelectedRows = selectedRows ? [...selectedRows] : [];
      nextSelectedRows[index] = !nextSelectedRows[index];
      setSelectedRows(nextSelectedRows);
    }
  };

  const clickHandler = (e: any, row: any) => {
    e.preventDefault();
    !!rowClickHandler && rowClickHandler(row);
  }

  React.useEffect(() => {
    if (selectedRows?.length > 0 && !!rowCheckHandler) rowCheckHandler(selectedRows);
  }, [selectedRows]);

  React.useEffect(() => {
    if (selectedRow !== undefined && selectedRow >= 0 && !!rowSelectHandler) rowSelectHandler(selectedRow);
  }, [selectedRow]);

  const dataToShow = data?.slice((currentPage - 1) * (rowsPerPage || 0), (!rowsPerPage || rowsPerPage <= 0) ? data.length : (currentPage * rowsPerPage));

  return (
    <>
      <Table responsive hover className="mt-2">
        <colgroup>
          {radioType === true && <col width={narrow ? '30px' : '50px'} />}
          {columns.map((col, i) => <col key={`col-grp-${col.field}`} width={col.width} /> )}
        </colgroup>
        {customHeaderJsx ??
          <thead className="thead-light">
          <tr>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            {radioType === true && <th rowSpan={secondLineColumns.length === 0 ? undefined : 2} />}
            {firstLineColumns.map((col) => <th key={`col-th-${col.field}`} colSpan={columnGroups[`${col.colGroup}`]?.length} rowSpan={secondLineColumns.length === 0 || columnGroups[`${col.colGroup}`]?.length > 0 ? undefined : 2} className="align-middle align-center">
              {col.check === true ? <Form.Check type="checkbox" onChange={(e) => checkHandler(-1, e.target.checked)} checked={data?.length > 0 && selectedRows?.every(r => r === true)} /> : col.title}
            </th>)}
          </tr>
          {secondLineColumns.length > 0 && <tr>
            {secondLineColumns.map((col) => <th key={`col-th2-${col.field}`} className="align-center">{col.title}</th> )}
          </tr>}
          </thead>}
        <tbody>
        {
          !!data && data.length > 0 ? dataToShow?.map((row, rowIdx) => {
            const rowKey = `row-${rowIdx}`;
            const radioKey = `radio-${rowIdx}`;

            return (
              <React.Fragment key={rowKey}>
                <tr onClick={() => setSelectedRow(rowIdx)} {...{valign: 'middle'}}>
                  {radioType === true && <td key={radioKey} className="align-center"><Form.Check type="radio" name={uniqueId} checked={selectedRow === rowIdx} onChange={e => setSelectedRow(rowIdx)} /></td>}
                  {columns.map((col, colIdx) => {
                    if (col.check === true) {
                      return (
                        <td key={`col-td-${col.field}`} className="align-center">
                          <Form.Check type="checkbox" onChange={(e) => checkHandler(rowIdx, e.target.checked)} checked={selectedRows[rowIdx] || false} />
                        </td>
                      );
                    }

                    const cls = col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-right' : 'text-left');
                    return <td key={`col-td-${col.field}`} className={cls}>{col.link === true ? <a href="src/components/common/table/data-table#" onClick={(e) => clickHandler(e, row)}><u>{row[col.field]}</u></a> : <>{row[col.field]}</> }</td>
                  })}
                </tr>
              </React.Fragment>
            );
          }) : <tr><td colSpan={columns.length} className="align-center" style={{'height':'100px'}}>{noDataText}</td></tr>
        }
        </tbody>
      </Table>

      {rowsPerPage > 0 && data.length > rowsPerPage && <Pagination currentPage={currentPage} rowsPerPage={rowsPerPage ?? 10} totalCount={data.length} pageHandler={setCurrentPage} />}
    </>
  );
}

AnchorsDataTable.defaultProps = {
  rowsPerPage: 10,
  rowClickHandler: undefined,
  rowCheckHandler: undefined,
  rowSelectHandler: undefined,
  customHeaderJsx: undefined,
  noDataText: undefined,
  narrow: false,
  radioType: false,
};

export default AnchorsDataTable;
