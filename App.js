
import React, {Component} from 'react';
import {Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Icon, Item, Label, Input } from 'native-base';
import firebase, { db } from 'logimeChan/firebase';

type Props = {};
export default class App extends Component<Props> {
  baseURl = 'https://myanimelist.net'
  observerAnimes
  constructor (props) {
    super(props)
    this.state = {
      animes: [],
      results: [],
      q: 'Yokusoku No Neverland'
    }
  }
  addAnime (anime) {
    var user = firebase.auth().currentUser;

    db.collection("users").doc(user.uid).collection("animes").add({
      mal_id: anime.id,
      name: anime.name,
    })
      .then(function () {
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }
  login () {
    let email = 'carlosturnerbenites@gmail.com'
    let password = 'secret'

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() =>{
        var user = firebase.auth().currentUser;

        db.collection("users").doc(user.uid).set({
          email: user.email,
          displayName: user.displayName
        }, {merge: true})

        this.getAnimes()
      })
      .then(() => {
      })
      .catch(function (error) {
        console.info(error)
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });

  }
  register () {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }
  render() {
    let items = this.state.results
    let animes = this.state.animes
    return (
      <Container>
        <Header />

        <Content>
          <List
            dataArray={animes}
            renderRow={(anime) =>
              <ListItem button avatar onPress={() => {}}>
                <Left>
                  <Thumbnail source={{ uri: anime.image_url }} />
                </Left>
                <Body>
                  <Text>{anime.name}</Text>
                </Body>
                <Right>
                  <Text note></Text>
                  <Icon name="ios-heart" style={{ color: 'red' }} />
                </Right>
              </ListItem>
            }
          >
          </List>
        </Content>

        <Item stackedLabel>
          <Label>Buscar..</Label>
          <Input value={this.state.q} onChangeText={this.find} />
        </Item>
        <Content>
          <List
            dataArray={items}
            renderRow={(item) =>
              <ListItem button avatar onPress={() => this.addAnime(item)}>
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
    this.findAnimes(text)
  }
  getAnimes () {
    var user = firebase.auth().currentUser;

    let path = db.collection("users").doc(user.uid).collection("animes")

    this.observerAnimes = path.onSnapshot(snapshot => {
      console.log(snapshot)
      let animes = []
      snapshot.forEach(doc => {
        animes.push(doc.data())
        // doc.id
      });
      this.setState({ animes })
    })
  }
  findAnimes (keyword) {
    let url = this.baseURl + '/search/prefix.json'
    let type = 'anime'
    // let keyword = 'yokusoku no'
    url = `${url}?type=${type}&keyword=${keyword}&v=1`
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
      .then((results) => {
        this.setState({ results })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  componentDidMount () {
    this.login()
    this.find(this.state.q)
  }
  unsub () {
    if (this.observerAnimes) { this.observerAnimes() }
  }
  componentWillUnmount () {
    this.unsub()
  }
}
