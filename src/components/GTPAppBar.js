import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    flex: {
      flex: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    GTPAppBar: {
        zIndex: theme.zIndex.drawer + 1,
    }
  });
  
  function GTPAppBar(props) {
    const { classes } = props;
    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.GTPAppBar}>
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={props.toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Group Travel Planner
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
  
  GTPAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(GTPAppBar);