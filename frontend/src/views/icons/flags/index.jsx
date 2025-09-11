import { countries } from '@/views/icons/flags/data';
import DataTable from '@/components/table/DataTable';
import TablePagination from '@/components/table/TablePagination';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader, Col, Container, Form, Row } from 'react-bootstrap';
import { LuFlag, LuSearch } from 'react-icons/lu';
import PageTitle from '@/components/PageTitle';
const columnHelper = createColumnHelper();
const Page = () => {
  const columns = [columnHelper.accessor('flag', {
    header: 'Flag',
    cell: ({
      row
    }) => <img src={row.original.flag} alt={row.original.code} height={18} width={18} className="rounded" />
  }), columnHelper.accessor('name', {
    header: 'Country Name'
  }), {
    header: 'Path',
    cell: ({
      row
    }) => <>@/assets/images/flags/{row.original.code}.svg</>
  }, columnHelper.accessor('code', {
    header: 'Code',
    cell: ({
      row
    }) => <>{row.original.code.toUpperCase()}</>
  })];
  const [data, _setData] = useState(() => [...countries]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25
  });
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    enableColumnFilters: true,
    enableRowSelection: true
  });
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = table.getFilteredRowModel().rows.length;
  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalItems);
  return <>
            <Container fluid>
                <PageTitle title="SVG Flags Library" subtitle="Browse a complete collection of scalable vector flags for countries and regions — perfect for language switchers and geo features." badge={{
        title: 'Country Flags',
        icon: LuFlag
      }} />

                <Row className="justify-content-center">
                    <Col cols={12}>
                        <Card>
                            <CardHeader className="justify-content-between">
                                <div>
                                    <h4 className="card-title mb-1 d-flex align-items-center gap-2">Flags Listing
                                        (SVG)</h4>
                                    <p className="mb-0 text-muted">We offer a set of scalable SVG flags, perfect for
                                        language selectors and international content.</p>
                                </div>
                                <div className="app-search">
                                    <Form.Control type="search" placeholder="Search country..." id="countrySearch" value={globalFilter ?? ''} onChange={e => setGlobalFilter(e.target.value)} />
                                    <LuSearch className="app-search-icon text-muted" />
                                </div>
                            </CardHeader>

                            <CardBody>
                                <DataTable table={table} emptyMessage="No records found" className="table-bordered" />
                            </CardBody>

                            {table.getRowModel().rows.length > 0 && <CardFooter className="border-0">
                                    <TablePagination totalItems={totalItems} start={start} end={end} previousPage={table.previousPage} canPreviousPage={table.getCanPreviousPage()} pageCount={table.getPageCount()} pageIndex={table.getState().pagination.pageIndex} setPageIndex={table.setPageIndex} nextPage={table.nextPage} canNextPage={table.getCanNextPage()} />
                                </CardFooter>}
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>;
};
export default Page;