'use client';
import { Slide, Chip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { GridColDef, GridApi, GridCellValue, DataGrid } from '@mui/x-data-grid';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { IUser } from "@/libs/interface/user";

import ModalAlert from '@/components/ModalAlert';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function UserList() {

  const [users, setUsers] = useState<any>([]);
  const [open, setOpen] = React.useState(false);

  const [selectedUser, setSelectedUser] = useState<any>();

  const [selectedUserToken, setSelectedUserToken] = useState<any>();
  const [userAdmin, setUserAdmin] = useState<any>();

  ///const [showModal, setShowModal] = useState(false);



  const [user, setUser] = useState<IUser>();

  const getUser = async () => {
    const inputs = {
        method: 'getOne',
        API_KEY: process.env.API_KEY,
        userToken: getCookie('admin')
    }
    const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
    })
    const user = await res.json()
    setUser(user.user.user)

    console.log(user.user.user);

  }

  useEffect(() => {

    getUser();

  }, []);



  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.01,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "userToken",
      headerName: "User Token",
      flex: 0.01,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.2,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "username",
      headerName: "Nick Name",
      flex: 0.2,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "coin",
      headerName: "Balance (CRA)",
      flex: 0.1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => {
        return new Number(params.value).toFixed(2);
      } ,
    },
    {
      field: "walletAddress",
      headerName: "Deposit Address",
      flex: 0.2,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },


    {
      field: "admin",
      headerName: "Admin",
      align: "center",
      headerAlign: "center",
      type: "number",
      flex: 0.1,
      minWidth: 75,

      renderCell(params) {
        return <Chip label={`${params.value ? "Admin" : "User"}`} color={`${params.value ? "success" : "info"}`} />;
      },
    },


   
    
    {
      field: "action",
      headerName: "Edit",
      align: "center",
      headerAlign: "center",
      sortable: false,
      width: 125,


      renderCell: (params) => {

        const onClick = (e:any) => {
          e.stopPropagation(); // don't select this row after clicking
  
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};
  
          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );
  

          setSelectedUserToken(thisRow.userToken);

          setUserAdmin(thisRow.admin);

          console.log("selectedUserToken: ", selectedUserToken);
          console.log("userAdmin: ", userAdmin);

      

          //handleClickOpen()


          //alert(JSON.stringify(thisRow, null, 4));


          //setShowModal(!showModal);


          return;

        };
  
        return (
          <></>

        /*
          <Button
            color="success" variant='contained' className='bg-green-500'
            onClick={onClick }>Edit
        
          </Button>
        */

        )
      }


/*
      renderCell: (params) => {

        const onClick = (e: any) => {

          e.stopPropagation(); // don't select this row after clicking


          
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );
          

          ///console.log("params.row: ", params.row);


          return duzenle(params.row);
        };


        if (user?.email === 'craclepro@gmail.com') {
          return (
            <Button
              //onClick={onClick}
              onClick={
                (e) => { setSelectedUser(params.row); handleClickOpen() }
              }
              color="success" variant='contained' className='bg-green-500'>
              Edit
            </Button>
          )
        }
        

      },
*/


    },
    
  


  ];

  function duzenle(e: any) {

    console.log("duzenle e: ", e);

    setSelectedUser(e);

    console.log("selectedUser: ", selectedUser);

    
    handleClickOpen()
  }


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    getAll()
  }, [])



  const getAll = async () => {
    const res = await fetch('/api/user', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: "getAll",
        API_KEY: process.env.API_KEY,
      }),
    })
    const data = await res.json()
    setUsers(data.users.users)
  }

  const updateUser = async () => {
    //let username = (document.getElementById("username") as HTMLInputElement).value
    //let email = (document.getElementById("email") as HTMLInputElement).value
    //let walletAddress = (document.getElementById("walletAddress") as HTMLInputElement).value
    //let coinBalance = (document.getElementById("coinBalance") as HTMLInputElement).value
    //let maticBalance = (document.getElementById("maticBalance") as HTMLInputElement).value
    let admin = (document.getElementById("admin") as HTMLInputElement).checked


    console.log("selectedUser.userToken: ", selectedUser?.userToken)

    const formInputs = {
      method: "update",
      API_KEY: process.env.API_KEY,
      
      //userToken: selectedUser.userToken,
      userToken: selectedUserToken,

      //username: username,
      //email: email,
      //walletAddress: walletAddress,
      ////deposit: coinBalance,
      ////maticBalance: maticBalance,
      admin: admin,
      //pass1: selectedUser.pass1,
      //pass2: selectedUser.pass2,
      //img: selectedUser.img,
    }

    handleClose();

    Swal.fire({
      title: 'Do you want to saved changes?',
      confirmButtonText: 'Save',
      showCloseButton: true,
      showCancelButton: true,
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/api/user', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formInputs),
        })
          .then(res => res.json())
          .then(data => {
            if (data.user.success) {
              Swal.fire('Saved!', '', 'success')
              getAll()
            } else {
              Swal.fire('Error!', '', 'error')
            }
          })
      } else if (result.isDismissed) {
        // do something
      }
    })
  }


  

  const deleteUser = async () => {
    handleClose()
    Swal.fire({
      title: 'Do you want to delete user?',
      confirmButtonText: 'Delete!',
      showCloseButton: true,
      showCancelButton: true,
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        const formInputs = {
          method: "delete",
          API_KEY: process.env.API_KEY,
          ///userToken: selectedUser.userToken,
          userToken: selectedUserToken,
        }
        fetch('/api/user', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formInputs),
        }).then(res => res.json()).then(data => {
          if (data.status) {
            Swal.fire('Deleted!', '', 'success')
            getAll();
          } else {
            Swal.fire('Error!', '', 'error')
            getAll();
          }
        })
      } else if (result.isDismissed) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }


  const rows = users.map((item: any, i: number) => {

    return {
      kayitId: item._id,
      id: i + 1,
      email: item.email,
      img: item.img,
      admin: item.admin,
      status: item.status,
      walletAddress: item.walletAddress,
      username: item.username,
      //pass1: item.pass1,
      //pass2: item.pass2,
      userToken: item.userToken,
      coin: item.deposit,
      //matic: item.maticBalance,

    }
  })


  return (
    <>
      <>

        <div className='flex flex-col p-10 mt-5 text-gray-200'>
          <h1 className='font-bold italic text-2xl'>Users</h1>
          <div style={{ width: "100%", height: 1200, color: "white" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={20}
              rowsPerPageOptions={[10]}
              hideFooterSelectedRowCount
              sx={{
               
                color: "white",
                bgcolor: "black",

              }}
              
            />
          </div>
        </div>

        {selectedUserToken && (
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle> User Edit Form  </DialogTitle>
            <DialogContent className='space-y-3'>

              <div className='flex gap-1 items-center'>
                <input type="checkbox" defaultChecked={userAdmin} id='admin' className="checkbox checkbox-primary" />
                <p>Admin?</p>
              </div>

            </DialogContent>
            <DialogActions>

            {user?.email === 'craclepro@gmail.com' && (
              <Button onClick={deleteUser}>DELETE</Button>
            )}

              <Button onClick={handleClose}>Close</Button>
              <Button color='success' onClick={updateUser}>Save</Button>
            </DialogActions>
          </Dialog>
        )}




      </>
    </>
  )
}
