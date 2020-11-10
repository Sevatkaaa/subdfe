import React from 'react';
import {render, fireEvent, queryByAttribute} from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect'
import axios from "axios";
import {getByText, queryByText, waitForElement} from "@testing-library/dom";

jest.mock('axios');
const getById = queryByAttribute.bind(null, "id");


const line = {
    "id": 21,
    "lineObjects": [
        {
            "id": 23,
            "name": "Length",
            "type": "INTEGER",
            "value": "20"
        },
        {
            "id": 24,
            "name": "Width",
            "type": "INTEGER",
            "value": "25"
        },
        {
            "id": 25,
            "name": "Short name",
            "type": "CHAR",
            "value": "B"
        },
        {
            "id": 22,
            "name": "Name",
            "type": "STRING",
            "value": "Baikal"
        }
    ]
};
const tables = [
    {
        "id": 15,
        "name": "Lakes",
        "header": {
            "id": 16,
            "attributes": [
                {
                    "id": 17,
                    "name": "Name",
                    "type": "STRING",
                    "maxLength": 20
                },
                {
                    "id": 18,
                    "name": "Length",
                    "type": "INTEGER",
                    "maxLength": 5
                },
                {
                    "id": 19,
                    "name": "Width",
                    "type": "INTEGER",
                    "maxLength": 5
                },
                {
                    "id": 20,
                    "name": "Short name",
                    "type": "CHAR",
                    "maxLength": 1
                }
            ]
        },
        "lines": [
            line,
            {
                "id": 26,
                "lineObjects": [
                    {
                        "id": 27,
                        "name": "Name",
                        "type": "STRING",
                        "value": "Sharl"
                    },
                    {
                        "id": 28,
                        "name": "Length",
                        "type": "INTEGER",
                        "value": "15"
                    },
                    {
                        "id": 29,
                        "name": "Width",
                        "type": "INTEGER",
                        "value": "24"
                    },
                    {
                        "id": 30,
                        "name": "Short name",
                        "type": "CHAR",
                        "value": "S"
                    }
                ]
            }
        ]
    }
]

test('get database list', async () => {
  const response = {data: [
          {id: "1", name: "Db1", tables: [{id: 4, name: "Test1"}, {id: 5, name: "Test2"}]},
          {id: "2", name: "Db2", tables: []},
          {id: "3", name: "Db3", tables: []}
        ]};
  axios.get.mockImplementationOnce(() => Promise.resolve(response));
  const { getByText } = render(<App />);
  const manageDbLink = getByText("Manage Databases");
  expect(manageDbLink).toBeInTheDocument();

  fireEvent.click(manageDbLink);

  const dbName1 = await waitForElement(() => getByText("Db1"));
  const dbName2 = getByText("Db2");
  const dbName3 = getByText("Db3");
  expect(dbName1).toBeInTheDocument();
  expect(dbName2).toBeInTheDocument();
  expect(dbName3).toBeInTheDocument();
  const tables1 = getByText("Test1, Test2");
  expect(tables1).toBeInTheDocument();
});

test('get table list', async () => {
    let db1 = {id: "1", name: "Db1", tables: tables};
    const dbsResponse = {data: [
            db1,
            {id: "2", name: "Db2", tables: []},
            {id: "3", name: "Db3", tables: []}
        ]};
    const dbResponse = {data: db1};
    axios.get.mockImplementationOnce(() => Promise.resolve(dbsResponse))
        .mockImplementationOnce(() => Promise.resolve(dbResponse))
        .mockImplementationOnce(() => Promise.resolve({data: tables[0]}))
        .mockImplementationOnce(() => Promise.resolve({data: [line]}));
    const app = render(<App />);
    const manageDbLink = getByText(app.container, "Manage Databases");
    expect(manageDbLink).toBeInTheDocument();

    fireEvent.click(manageDbLink);

    const dbName1 = await waitForElement(() => getByText(app.container, "Db1"));
    const dbName2 = getByText(app.container, "Db2");
    const dbName3 = getByText(app.container, "Db3");
    expect(dbName1).toBeInTheDocument();
    expect(dbName2).toBeInTheDocument();
    expect(dbName3).toBeInTheDocument();
    const tables1 = getByText(app.container, "Lakes");
    expect(tables1).toBeInTheDocument();

    // press actions -> view/edit tables
    let drop1 = getById(app.container, 'drop-1');
    expect(drop1).toBeInTheDocument();

    fireEvent.click(drop1);

    let editDb1 = getById(app.container, 'edit-1');
    expect(editDb1).toBeInTheDocument();

    fireEvent.click(editDb1);

    // DB page - look for table
    const tableName = await waitForElement(() => getByText(app.container, "Lakes"));
    expect(tableName).toBeInTheDocument();

    const tableHeader1 = getByText(app.container, "Name(STRING, max=20)");
    expect(tableHeader1).toBeInTheDocument();
    const tableHeader2 = getByText(app.container, "Length(INTEGER, max=5)");
    expect(tableHeader2).toBeInTheDocument();
    const tableHeader3 = getByText(app.container, "Width(INTEGER, max=5)");
    expect(tableHeader3).toBeInTheDocument();
    const tableHeader4 = getByText(app.container, "Short name(CHAR, max=1)");
    expect(tableHeader4).toBeInTheDocument();

    // press actions -> view/edit data
    let dropTable1 = await waitForElement(() => getById(app.container, 'drop-15'));
    expect(dropTable1).toBeInTheDocument();

    fireEvent.click(dropTable1);

    let editTable1 = await waitForElement(() => getById(app.container, 'editTable-15'));
    expect(editTable1).toBeInTheDocument();

    fireEvent.click(editTable1);

    // Table page - look for table action -> 2 rows found
    const filterButton = await waitForElement(() => getByText(app.container, "Filter by value"));
    expect(filterButton).toBeInTheDocument();

    const firstRecord = getByText(app.container, "Baikal");
    expect(firstRecord).toBeInTheDocument();

    const secondRecord = getByText(app.container, "Sharl");
    expect(secondRecord).toBeInTheDocument();

    const searchValue = getById(app.container, 'formGroupFirstName');
    expect(searchValue).toBeInTheDocument();

    searchValue.value = "Baikal";

    fireEvent.click(filterButton);

    //after filter by value
    const notification = await waitForElement(() => getByText(app.container, "Lines filtered"));
    expect(notification).toBeInTheDocument();

    const correctRecord = getByText(app.container, "Baikal");
    expect(correctRecord).toBeInTheDocument();

    const incorrectRecord = queryByText(app.container, "Sharl")
    expect(incorrectRecord).toBeNull();
});
