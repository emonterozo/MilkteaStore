import React, {useContext, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  FlatList,
  HStack,
  Icon,
  IconButton,
  Image,
  Modal,
  Text,
  VStack,
  Select,
  CheckIcon,
  FormControl,
  Input,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {isEmpty} from 'lodash';

import InformationOutline from '../../../assets/svg/InformationOutline/InfoOutline';
import {Header} from '../../../components';
import GlobalContext from '../../../config/context';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  addOrderRequest,
  getProductsRequest,
  updateProductRequest,
} from '../../../services/request';

const Store = () => {
  const {authenticatedUser} = useContext(GlobalContext);
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    id: '',
    name: '',
    priceList: [],
  });
  const [order, setOrder] = useState({
    size: '',
    price: 0,
    quantity: 1,
    amount: 0,
  });
  let row: Array<any> = [];
  let prevOpenedRow: any;

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    getProductsRequest(authenticatedUser.store._id, authenticatedUser.token)
      .then(res => setProducts(res.products))
      .catch(err => console.log(err));
  };

  const toggleProductAvailability = (isAvailable: Boolean, product: String) => {
    updateProductRequest(product, isAvailable, authenticatedUser.token)
      .then(() => {
        getProducts();
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (!isEmpty(order.size)) {
      const holder = selectedProduct.priceList.filter(
        item => item.value === order.size,
      );
      setOrder({
        ...order,
        price: holder[0].price,
        amount: order.quantity * holder[0].price,
      });
    }
  }, [order.quantity, order.size]);

  const renderProduct = ({item, index}) => {
    const closeRow = index => {
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    };

    const renderRightActions = () => {
      return (
        <Box w="25%" justifyContent="center" alignItems="center" m={2}>
          <IconButton
            icon={
              <Icon
                color="amber.900"
                as={MaterialCommunityIcons}
                name={!item.available ? 'check' : 'minus'}
              />
            }
            bg={!item.available ? 'green.400' : 'error.400'}
            size="lg"
            onPress={() => toggleProductAvailability(!item.available, item._id)}
          />
        </Box>
      );
    };

    return (
      <GestureHandlerRootView>
        <Swipeable
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX)
          }
          onSwipeableOpen={() => closeRow(index)}
          ref={ref => (row[index] = ref)}>
          <TouchableOpacity
            onPress={() => {
              if (item.available) {
                const holder = item.price_list.map(item => {
                  return {
                    label: `${item.description} (PHP ${item.price})`,
                    value: item.description,
                    price: item.price,
                  };
                });
                setSelectedProduct({
                  id: item._id,
                  name: item.name,
                  priceList: holder,
                });
                setOrder({
                  ...order,
                  size: holder[0].value,
                  quantity: 1,
                });
                setIsModalVisible(true);
              }
            }}>
            <Box
              bg={!item.available ? 'error.400' : null}
              key={item._id}
              mb={2}
              marginX={2}
              borderWidth="1"
              borderColor="muted.400"
              borderRadius="sm">
              <HStack>
                <Box w="40%" marginLeft="0.5" marginY="0.5">
                  <Image
                    alt="Banner"
                    source={{uri: item.image}}
                    style={styles.flex}
                    borderLeftRadius="sm"
                  />
                </Box>
                <VStack flex={1} marginX="1" p={1}>
                  <Text>{item.name}</Text>
                  <Text>{item.description}</Text>
                  <Divider marginY={1} />
                  {item.price_list.map(variant => (
                    <HStack space={2}>
                      <Text fontWeight="bold">{`${variant.description}:`}</Text>
                      <Text fontWeight="semibold">{`PHP ${variant.price}`}</Text>
                    </HStack>
                  ))}
                </VStack>
              </HStack>
            </Box>
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  const placeOrder = () => {
    const payload = {
      ...order,
      owner: authenticatedUser.store.owner,
      store: authenticatedUser.store._id,
      product: selectedProduct.id,
      timestamp: new Date(),
    };
    addOrderRequest(payload, authenticatedUser.token)
      .then(res => {
        console.log(res);
        setIsModalVisible(false);
      })
      .catch(err => console.log(err));
  };

  return (
    <Box flex={1}>
      <Header title={authenticatedUser.store.store_name} isLogoutVisible />
      <Box flex={1} marginTop={2}>
        <FlatList
          data={products}
          renderItem={renderProduct}
          contentContainerStyle={products.length === 0 && styles.flex}
          ListEmptyComponent={
            <Center h="100%">
              <InformationOutline height={100} width={100} color="#777777" />
              <Text>No products yet</Text>
            </Center>
          }
        />
      </Box>
      <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{selectedProduct.name}</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Size</FormControl.Label>
              <Select
                selectedValue={order.size}
                minWidth="200"
                accessibilityLabel="Choose Service"
                placeholder="Choose Service"
                _selectedItem={{
                  bg: 'teal.600',
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={itemValue => {
                  setOrder({
                    ...order,
                    size: itemValue,
                  });
                }}>
                {selectedProduct.priceList.map(product => (
                  <Select.Item label={product.label} value={product.value} />
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormControl.Label>Quantity</FormControl.Label>
              <Input
                type="text"
                InputRightElement={
                  <HStack space={2} marginRight={2} alignItems="center">
                    <Icon
                      as={MaterialCommunityIcons}
                      name="minus"
                      size="lg"
                      onPress={() => {
                        if (order.quantity !== 1) {
                          setOrder({
                            ...order,
                            quantity: order.quantity - 1,
                          });
                        }
                      }}
                    />
                    <Icon
                      as={MaterialCommunityIcons}
                      name="plus"
                      size="lg"
                      onPress={() => {
                        setOrder({
                          ...order,
                          quantity: order.quantity + 1,
                        });
                      }}
                    />
                  </HStack>
                }
                isReadOnly
                value={order.quantity.toString()}
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onPress={placeOrder}>{`Place Order (${order.amount})`}</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default Store;
