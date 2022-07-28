import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, Heading, Icon, Input, Text, VStack} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {isEmpty, isNull} from 'lodash';

import {loginRequest} from '../../services/request';
import {storeUser} from '../../utils/utils';
import GlobalContext from '../../config/context';

const Login = () => {
  const {setAuthenticatedUser} = useContext(GlobalContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError('');
  }, [username, password]);

  const login = () => {
    if (!isEmpty(username) || !isEmpty(password)) {
      setIsLoading(true);
      loginRequest(username, password)
        .then(res => {
          setIsLoading(false);
          if (!isNull(res.error)) {
            setError(res.error);
          } else {
            setAuthenticatedUser(res.data);
            storeUser(res.data);
          }
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <VStack w="90%" space={1} marginBottom="10">
        <Heading color="muted.800">Welcome back!</Heading>
        <Text color="muted.400">Login with your existing account</Text>
      </VStack>
      <Text color="error.400" w="85%" mb="2">
        {error}
      </Text>
      <VStack w="90%" space={5}>
        <Input
          InputLeftElement={
            <Icon
              as={MaterialCommunityIcons}
              name="account-outline"
              color="muted.400"
              size={5}
              ml="2"
            />
          }
          onChangeText={setUsername}
          value={username}
          variant="rounded"
          placeholder="Username"
        />
        <Input
          InputLeftElement={
            <Icon
              as={MaterialCommunityIcons}
              name="lock-outline"
              color="muted.400"
              size={5}
              ml="2"
            />
          }
          onChangeText={setPassword}
          value={password}
          type="password"
          variant="rounded"
          placeholder="Password"
        />
      </VStack>
      <Button
        isLoading={isLoading}
        variant="solid"
        rounded="full"
        size="lg"
        marginY={10}
        w="60%"
        onPress={login}>
        LOG IN
      </Button>
    </Box>
  );
};

export default Login;
