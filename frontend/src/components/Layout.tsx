import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material'
import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import CreateIcon from '@mui/icons-material/Create'
import DescriptionIcon from '@mui/icons-material/Description'
import PersonIcon from '@mui/icons-material/Person'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import HomeIcon from '@mui/icons-material/Home'
import Router from 'next/router'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Profile, setLogin, setProfile } from 'src/redux/reducers/userReducer'
import axios, { AxiosError, AxiosResponse } from 'axios'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const isLogin = useSelector((store: Store) => {
    return store.user.login
  })
  const profile = useSelector((store: Store) => {
    return store.user.profile
  }, shallowEqual)
  const dispatch = useDispatch()

  const [logout, setLogout] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    axios
      .get('http://localhost:8000/user/auth')
      .then((response: AxiosResponse<Profile | undefined>) => {
        if (response.data) {
          dispatch(setLogin(true))
          dispatch(setProfile(response.data))
        } else {
          dispatch(setLogin(false))
          dispatch(setProfile(undefined))
        }
      })
      .catch((error: AxiosError) => {
        console.log(error)
      })
  }, [dispatch, Router.asPath])

  const logoutHandler = useCallback(async () => {
    axios
      .get('http://localhost:8000/logout')
      .then(() => {
        dispatch(setLogin(false))
        Router.push('/').then(() => {
          setLogout(true)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }, [dispatch])

  return (
    <>
      {children}
      <SpeedDial
        ariaLabel="speedDial"
        className="mui-fixed"
        sx={{ position: 'fixed', bottom: 30, right: 30 }}
        icon={<SpeedDialIcon />}
      >
        {!isLogin && (
          <SpeedDialAction
            icon={<LoginIcon />}
            tooltipTitle="?????????"
            onClick={() => {
              Router.push(process.env.LOGIN_URL as string)
            }}
          />
        )}
        {isLogin && (
          <SpeedDialAction
            icon={<LogoutIcon />}
            tooltipTitle="????????????"
            onClick={logoutHandler}
          />
        )}

        {isLogin && (
          <SpeedDialAction
            icon={<PersonIcon />}
            tooltipTitle="??? ??????"
            onClick={() => {
              setOpen(true)
            }}
          />
        )}
        {Router.asPath != '/application' && (
          <SpeedDialAction
            icon={<DescriptionIcon />}
            tooltipTitle="????????? ??????"
            onClick={() => {
              Router.push('/application')
            }}
          />
        )}
        {Router.asPath != '/' && (
          <SpeedDialAction
            icon={<HomeIcon />}
            tooltipTitle="??????"
            onClick={() => {
              Router.push('/')
            }}
          />
        )}
      </SpeedDial>
      <Snackbar
        open={logout}
        autoHideDuration={3000}
        onClose={() => {
          setLogout(false)
        }}
      >
        <Alert
          onClose={() => {
            setLogout(false)
          }}
          severity="success"
          sx={{ width: '100%', fontFamily: 'nanumSquare' }}
        >
          ??????????????? ???????????? ?????????????????????.
        </Alert>
      </Snackbar>

      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <DialogTitle fontFamily="nanumSquare" sx={{ fontWeight: 800 }}>
          ??? ??????
        </DialogTitle>
        <DialogContent>
          <DialogContentText fontFamily="nanumSquare" sx={{ color: 'black' }}>
            ?????????: {profile?.email}
            <br />
            ??????: {profile?.username}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ fontFamily: 'nanumSquare' }}
            onClick={() => {
              setOpen(false)
            }}
          >
            ??????
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Layout
