import React, {useContext, useEffect, useState} from 'react';
import {
  Box,
  HStack,
  Image,
  Text,
  VStack,
  Divider,
  Button,
  Center,
  FlatList,
} from 'native-base';
import {Header} from '../../../components';
import {StyleSheet} from 'react-native';
import {ORDER_STATUS} from '../../../utils/constant';
import {isEqual} from 'lodash';
import moment from 'moment';

import {getOrdersRequest, updateOrderRequest} from '../../../services/request';
import GlobalContext from '../../../config/context';
import InformationOutline from '../../../assets/svg/InformationOutline/InfoOutline';

const Orders = () => {
  const {authenticatedUser} = useContext(GlobalContext);
  const [status, setStatus] = useState(ORDER_STATUS.PROCESSING);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrder();
  }, [status]);

  const getOrder = () => {
    const payload = {
      store: authenticatedUser.store._id,
      status: status,
      timestamp: moment().format('YYYY-MM-DD'),
    };
    getOrdersRequest(payload, authenticatedUser.token)
      .then(res => {
        setOrders(res.orders);
      })
      .catch(err => console.log(err));
  };

  const updateOrder = (order: string) => {
    updateOrderRequest(order, ORDER_STATUS.COMPLETED, authenticatedUser.token)
      .then(res => {
        getOrder();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const renderOrders = ({item, index}) => (
    <Box
      mb={2}
      marginX={2}
      borderWidth="1"
      borderColor="muted.400"
      borderRadius="sm">
      <HStack>
        <Box w="40%" marginLeft="0.5" marginY="0.5">
          <Image
            alt="Banner"
            source={{
              uri: item.image,
            }}
            style={styles.flex}
            borderLeftRadius="sm"
          />
        </Box>
        <VStack marginX="1" p={1}>
          <Text>{item.name}</Text>
          <Text>{item.description}</Text>
          <Divider marginY={1} />
          <HStack space={2}>
            <Text fontWeight="bold">Price:</Text>
            <Text fontWeight="semibold">{`PHP ${item.unit_price}`}</Text>
          </HStack>
          <HStack space={2}>
            <Text fontWeight="bold">Quantity:</Text>
            <Text fontWeight="semibold">{item.quantity}</Text>
          </HStack>
          <HStack space={2}>
            <Text fontWeight="bold">Amount:</Text>
            <Text fontWeight="semibold">{`PHP ${item.amount}`}</Text>
          </HStack>
          {isEqual(item.status, ORDER_STATUS.PROCESSING) && (
            <Button
              marginTop={2}
              size="xs"
              onPress={() => updateOrder(item.id)}>
              Complete Order
            </Button>
          )}
        </VStack>
      </HStack>
    </Box>
  );

  return (
    <Box flex={1}>
      <Header title="Orders" isLogoutVisible />
      <Box>
        <HStack bg="primary.600">
          <Button
            variant="outline"
            borderRadius={0}
            borderWidth={0}
            flex={1}
            _text={styles.selected}
            onPress={() => setStatus(ORDER_STATUS.PROCESSING)}>
            PROCESSING
          </Button>
          <Button
            variant="outline"
            borderRadius={0}
            borderWidth={0}
            flex={1}
            _text={styles.selected}
            onPress={() => setStatus(ORDER_STATUS.COMPLETED)}>
            COMPLETED
          </Button>
        </HStack>
        <HStack bg="primary.600">
          <Box flex={1} alignItems="center">
            <Divider
              h={1}
              w="90%"
              bg={
                isEqual(status, ORDER_STATUS.PROCESSING)
                  ? 'secondary.500'
                  : 'primary.600'
              }
              borderRadius={10}
            />
          </Box>
          <Box flex={1} alignItems="center">
            <Divider
              h={1}
              w="90%"
              bg={
                isEqual(status, ORDER_STATUS.COMPLETED)
                  ? 'secondary.500'
                  : 'primary.600'
              }
              borderRadius={10}
            />
          </Box>
        </HStack>
      </Box>
      <Box flex={1} marginTop={2}>
        <FlatList
          data={orders}
          renderItem={renderOrders}
          contentContainerStyle={orders.length === 0 && styles.flex}
          ListEmptyComponent={
            <Center h="100%">
              <InformationOutline height={100} width={100} color="#777777" />
              <Text>No orders yet</Text>
            </Center>
          }
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  selected: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Orders;
