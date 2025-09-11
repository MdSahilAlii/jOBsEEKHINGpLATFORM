import ComponentCard from '@/components/ComponentCard';
import { useRef, useState } from 'react';
import { Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import DT from 'datatables.net-bs5';
import DataTable from 'datatables.net-react';
import 'datatables.net-responsive';
import ReactDOMServer from 'react-dom/server';
import { TbChevronLeft, TbChevronRight, TbChevronsLeft, TbChevronsRight } from 'react-icons/tb';
import { columns, tableData } from '@/views/tables/data-tables/data';
import PageTitle from "@/components/PageTitle";
import { LuColumns2 } from "react-icons/lu";
const columnLabels = ['Company', 'Symbol', 'Price', 'Change', 'Volume', 'Market Cap', 'Rating', 'Status'];
const Example = () => {
  DataTable.use(DT);
  const tableRef = useRef(null);
  const [visibleColumns, setVisibleColumns] = useState(() => new Array(columnLabels.length).fill(true));
  const handleColumnToggle = index => {
    if (tableRef.current) {
      const column = tableRef.current.dt()?.column(index);
      const currentVisible = column?.visible();
      column?.visible(!currentVisible);
      setVisibleColumns(prev => {
        const updated = [...prev];
        updated[index] = !currentVisible;
        return updated;
      });
    }
  };
  return <ComponentCard title="Example">
            <Dropdown autoClose="outside" className="mb-3">
                <Dropdown.Toggle variant="secondary" size="sm">
                    Show/Hide Columns
                </Dropdown.Toggle>

                <Dropdown.Menu className="p-2 border shadow-sm">
                    {columnLabels.map((label, index) => <Dropdown.Item key={index} as="div" className="px-0">
                            <Form.Check type="checkbox" id={`colToggle${index}`} label={label} checked={visibleColumns[index]} onChange={() => handleColumnToggle(index)} className="ms-2" />
                        </Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>

            <DataTable ref={tableRef} data={tableData.body} columns={columns} options={{
      responsive: true,
      language: {
        paginate: {
          first: ReactDOMServer.renderToStaticMarkup(<TbChevronsLeft className="fs-lg" />),
          previous: ReactDOMServer.renderToStaticMarkup(<TbChevronLeft className="fs-lg" />),
          next: ReactDOMServer.renderToStaticMarkup(<TbChevronRight className="fs-lg" />),
          last: ReactDOMServer.renderToStaticMarkup(<TbChevronsRight className="fs-lg" />)
        }
      }
    }} className="table table-striped dt-responsive align-middle mb-0">
                <thead className="thead-sm text-uppercase fs-xxs">
                <tr>
                    {tableData.header.map((label, idx) => <th key={idx}>{label}</th>)}
                </tr>
                </thead>
            </DataTable>
        </ComponentCard>;
};
const Page = () => {
  return <Container fluid>
            <PageTitle title="Toggle Table Columns" subtitle="Easily show or hide table columns dynamically using DataTables column visibility features and control buttons." badge={{
      title: 'Column Visibility',
      icon: LuColumns2
    }} />

            <Row className="justify-content-center">
                <Col cols={12}>
                    <Example />
                </Col>
            </Row>
        </Container>;
};
export default Page;