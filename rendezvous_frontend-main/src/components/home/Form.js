import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';

const host = 'https://rendezvous2022.herokuapp.com';

const Input = styled('input')({
  display: 'none',
});

async function createPost(router, setError, setOpen, setCreating) {
  var filesSelected = document.getElementById("contained-button-file").files;

  if (filesSelected.length > 0) {
    var fileToLoad = filesSelected[0];

    var fileReader = new FileReader();

    fileReader.onloadend = async function () {
      var base64 = fileReader.result;
      let body = {
        title: document.getElementById('post-name').value,
        body: document.getElementById('standard-basic').value,
        image: base64
      }
      const response = await fetch(`${host}/api/post/create`, {
        method: 'POST',
        headers: {
          "content-type": "application/json",
          authtoken:
            JSON.parse(localStorage.getItem('user')).authtoken,
        },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        router.push('/');
      }else{
        let json = await response.json()
        setError(json);
        setOpen(true)
        setCreating(false)
      }
    }
    fileReader.readAsDataURL(fileToLoad);
  } else {
    let body = {
      title: document.getElementById('post-name').value,
      body: document.getElementById('standard-basic').value
    }
    const response = await fetch(`${host}/api/post/create`, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
        authtoken:
          JSON.parse(localStorage.getItem('user')).authtoken,
      },
      body: JSON.stringify(body),
    });
    if (response.status === 200) {
      router.push('/');
    }else{
      let json = await response.json()
      setError(JSON.stringify(json.errors[0].msg));
      setOpen(true)
      setCreating(false)
    }
  }

}

export default function BasicTextFields() {
  const [creating, setCreating] = useState(false);
  const [filename, setFilename] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <>
      {creating && <img src='https://c.tenor.com/gJLmlIn6EvEAAAAM/loading-gif.gif' width='100px' height='100px' />} <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="post-name" label="Name of the Post" variant="outlined" />
        <TextareaAutosize minRows={3} maxRows={10} placeholder="Enter something..." id="standard-basic" label="Description" variant="standard" className="formDesc" style={{padding: '10px', fontSize: '15px'}} />

        <Stack direction="row" alignItems="center" spacing={2}>

          <label htmlFor="icon-button-file" className="custom-file-upload">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <label htmlFor="contained-button-file">
                <Input id="contained-button-file" type="file" accept="image/*, video/*" onChange={(e) => setFilename(e.target.files[0].name)} />
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </label>
              &ensp;
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h6 style={{ fontWeight: 500, fontSize: "10px" }}>Maximum File Size: 49MB</h6>
                <h6 style={{ fontWeight: 500, fontSize: "10px" }}>{filename}</h6>

              </div>

            </IconButton>
          </label>
        </Stack>
        <Button
          color="primary"
          variant="contained"
          onClick={async (e) => {
            e.preventDefault();
            setCreating(true);
            createPost(router, setError, setOpen, setCreating);
            // router.push('/');
          }}
        >

          Create
        </Button>
      <Snackbar
        open={open}
        style={{top: '100%'}}
        >
        <Alert severity="error" sx={{ width: '100%'}}>
          {error}
        </Alert>
      </Snackbar>
      </Box>
    </>

  );
}
