import { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddBook from './addBstore';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css'


ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const [books, setBooks] = useState([]);

  const [colDefs, setColDefs] = useState([
    {field: 'title', sortable: true, filter: true},
    {field: 'author', sortable: true, filter: true},
    {field: 'year', sortable: true, filter: true},
    {field: 'isbn', sortable: true, filter: true},
    {field: 'price', sortable: true, filter: true},
    {
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params =>
        <IconButton onClick={() => deleteBook(params.value)} size='small' color='error'>
            <DeleteIcon/>
        </IconButton>
    }

  ]);

  useEffect(() => {
    fetchItems();
  }, [])

  const fetchItems = () => {
    fetch('https://bookstore-6876e-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.log(err))

  }

    // Add keys to the books objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setBooks(valueKeys);
  }

  const addBook = (newBook) => {
    fetch('https://bookstore-6876e-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchItems())
    .catch(err => console.log(err))
  }
  
  const deleteBook = (id) => {
    fetch(`https://bookstore-6876e-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
      {
        method: 'DELETE',
      })
      .then(response => fetchItems())
      .catch(err => console.log(err))
  }
  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography>
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook}/>
      <div style={{height: 500, width: 1200}}>
      <AgGridReact
        rowData={books}
        columnDefs={colDefs}/>

      </div>
    </>
  )
}

export default App
