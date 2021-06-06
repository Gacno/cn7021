import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import ClassRoundedIcon from '@material-ui/icons/ClassRounded';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import GitHubIcon from '@material-ui/icons/GitHub';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { getClasses } from '../../actions/classroom';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    float: 'right'
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    fontFamily: 'Acme, sans-serif',
    fontWeight: 'bolder',
    color: '#000000'
  },
  list: {
    width: 300
  },
  fullList: {
    width: 'auto'
  },
  cardtitle: {
    fontSize: 14,
    width: 150
  },
  pos: {
    fontWeight: 'bolder'
  },
  menu: {
    top: 50
  },
  classLink: {
    color: 'inherit'
  },
  logoutbutton: {
    background: 'none',
    '&:hover': {
      background: 'rgba(183, 183, 183, 0.47)'
    }
  }
}));

const Navbar = ({
  auth: { isAuthenticated },
  logout,
  classroom: { classrooms, classroom },
  getClasses
}) => {
  const classes = useStyles();
  const [state, setState] = useState({ left: false });
  useEffect(() => {
    if (isAuthenticated) getClasses();
  }, [getClasses, isAuthenticated]);
  const location = useLocation();
  const pathname = location.pathname;
  const getTheme = pathname.includes('/dashboard') || pathname.includes('/class/');

  const authLinks = (
    <Button
      onClick={logout}
      href="/#!"
      className={classes.logoutbutton}
      startIcon={<i className="fas fa-sign-out-alt" />}
    >
      Logout
    </Button>
  );

  const guestLinks = (
    <Link component={Button} to="/login" startIcon={<i className="fas fa-sign-in-alt" />}>
      Login
    </Link>
  );
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, left: open });
  };
  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  };
  const getNavbar = (
    <Toolbar>
      <IconButton
        edge="start"
        className={classes.menuButton}
        onClick={toggleDrawer(true)}
        aria-label="menu"
      >
        <MenuIcon />
      </IconButton>
      <Typography component="a" href="/" variant="h6" className={classes.title}>
        Manthan
      </Typography>
      {isAuthenticated ? authLinks : guestLinks}
    </Toolbar>
  );
  return (
    <>
      {getTheme ? (
        <>
          <AppBar color="transparent">{getNavbar}</AppBar>
        </>
      ) : (
        <AppBar color="inherit">{getNavbar}</AppBar>
      )}
      <Toolbar />
      <Divider />
      <Drawer
        className={classes.list}
        open={state['left']}
        onClose={toggleDrawer(false)}
        role="presentation"
      >
        <List className={classes.list}>
          <ListItem button component="a" href="/dashboard">
            <ListItemIcon>
              <HomeRoundedIcon />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </ListItem>
        </List>
        <Divider />
        <List
          component="nav"
          aria-labelledby="list-subheader"
          subheader={
            <ListSubheader component="div" id="list-subheader">
              {' '}
              Enrolled{' '}
            </ListSubheader>
          }
          style={{ marginLeft: '0.2rem' }}
        >
          {classrooms !== []
            ? classrooms.map((Class) => {
                return (
                  <ListItem
                    key={Class.code}
                    className={classes.classLink}
                    button
                    component="a"
                    style={{
                      backgroundColor:
                        classroom && Class.code === classroom.code ? 'rgba(0, 0, 0, 0.25)' : 'white'
                    }}
                    href={`/class/${Class.code}/`}
                  >
                    <ListItemIcon>
                      <ClassRoundedIcon />
                    </ListItemIcon>
                    <ListItemText color="textPrimary"> {truncate(Class.name, 12)}</ListItemText>
                  </ListItem>
                );
              })
            : null}
        </List>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <SettingsRoundedIcon />
            </ListItemIcon>
            <ListItemText>Setting</ListItemText>
          </ListItem>
          <ListItem button component="a" href="https://github.com/Manthan933/Manthan">
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText>GitHub</ListItemText>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  classroom: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classroom: state.classroom
});

export default connect(mapStateToProps, { logout, getClasses })(Navbar);
