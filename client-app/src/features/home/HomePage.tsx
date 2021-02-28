import React, { Fragment } from 'react';
import { Container, Segment, Header, Button, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { useContext } from 'react';
import LoginForm from '../../app/user/LoginForm';

const HomePage = () => {
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user} = rootStore.userStore;
    const {openModal} = rootStore.modalStore;
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image
                        size='massive'
                        src='/assets/logo.png'
                        alt='logo'
                        style={{ marginBottom: 12 }}
                    />
                    dotReact
                </Header>
                {isLoggedIn && user ? (
                <Fragment>    
                <Header as='h2' inverted content={`Welcome back ${user.displayName}`}/>
                    <Button as={Link} to='/activities' size='huge' inverted>
                    Go to activities!
                    </Button>
                </Fragment>   
                ) : (
                    <Fragment>
                        <Header as='h2' inverted content='Welcome to dotReact' />
                        <Button onClick={() => openModal(<LoginForm />)} size='huge' inverted>
                            Login
                        </Button>
                        <Button as={Link} to='/register' size='huge' inverted>
                            Register
                        </Button>
                    </Fragment>
                )}
                
            </Container>
        </Segment>
    );
};

export default HomePage;
