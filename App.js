/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {
  Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Icon, Item, Label, Input } from 'native-base';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor (props) {
    super(props)
    this.state = {
      animes: []
    }
  }
  render() {
    let items = this.state.animes
    return (
      <Container>
        <Header />
        <Item stackedLabel>
          <Label>Buscar..</Label>
          <Input onChangeText={this.find} />
        </Item>
        <Content>
          <List
            dataArray={items}
            renderRow={(item) =>
              <ListItem button avatar onPress={() => {}}>
                <Left>
                  <Thumbnail source={{ uri: item.image_url }} />
                </Left>
                <Body>
                  <Text>{item.name}</Text>
                </Body>
                <Right>
                  <Text note>{item.es_score}</Text>
                  <Icon name="ios-heart" style={{ color: 'red' }} />
                </Right>
              </ListItem>
            }
          >
          </List>
        </Content>
      </Container>
    );
  }
  find = (text) => {
    console.log(text)
    this.getAnimes(text)
  }
  getAnimes (keyword) {
    let url = this.baseURl + '/search/prefix.json'
    let type = 'anime'
    // let keyword = 'yokusoku no'
    url = `${url}?type=${type}&keyword=${keyword}&v=1`
    console.log(url)
    // ?type=anime&keyword=yokusoku&v=1

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      /*
      body: JSON.stringify({
        firstParam: 'yourValue',
        secondParam: 'yourOtherValue',
      }),
      */
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let object = responseJson.categories.find(c => c.type === type)
        return object.items;
      })
      .then((animes) => {
        console.log(animes)
        this.setState({ animes })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  baseURl = 'https://myanimelist.net'
  componentDidMount () {

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
