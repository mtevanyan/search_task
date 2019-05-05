import React, {Component} from 'react';
import SearchingPhotos from './components/searchingPhotos'
import './App.css';
import {Droppable} from "react-drag-and-drop";

const API_KEY = "01ead918e8726a04aa370768d222d316";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            baskets: {},
            searches: [],
            basketContent: [],
        };
    }

    searchPhoto(e) {
        e.preventDefault();
        this.setState({
            photos: [],
            basketContent: [],
            searches: [],
        });

        const search_word = e.target.elements.Search.value;

        if (search_word) {
            let baskets = {}

            let searches = search_word.split(' ');


            this.setState({
                searches: searches,
                baskets: baskets
            });

            searches.map((word) => {

                baskets[word] = [];

                fetch(
                    `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&tags=${word}&per_page=5&format=json&nojsoncallback=1`
                ).then((response) => {
                    return response.json();
                }).then((data) => {
                    if (data.photos && data.photos.photo) {
                        this.setState({
                            photos: this.state.photos.concat(data.photos.photo.map((photo) => {
                                    return {
                                        src: 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_' + ['s'] + '.jpg',
                                        data: photo,
                                        type: word,
                                        id: photo.id,
                                    }
                                })
                            )
                        });
                    }
                });
            });

        } else {
            this.setState({
                baskets: {}
            })
        }

    }

    onDrop(data) {
        let baskets = this.state.baskets;
        let photos = [];
        Object.keys(data).map((type) => {
            photos = this.state.photos.filter((item) => {
                if (item.id === data[type]) {
                    baskets[type].push(item);
                    return false;
                }

                return true;
            });
        });

        this.setState({
            baskets: baskets,
            photos: photos
        });
    }

    showBasket(basketType) {
        this.setState({
            basketContent: this.state.baskets[basketType]
        })
    }

    render() {
        let baskets = this.state.baskets;
        return (
            <div className="main-container">
                <form onSubmit={this.searchPhoto.bind(this)}>
                    <input type="text" name="Search" placeholder="search"/>
                    <button>search</button>
                </form>

                <SearchingPhotos photos={this.state.photos}/>

                {Object.keys(baskets).map((basketType, id) => {
                    return (

                        <Droppable
                            className="basket"
                            key={id}
                            types={[basketType]}
                            onDrop={this.onDrop.bind(this)}
                            onClick={this.showBasket.bind(this, basketType)}
                        >

                            <div>
                                {basketType}

                            </div>
                        </Droppable>

                    )
                })}

                <div className="basket-content">
                    {this.state.basketContent.map((item) => {
                        return (
                            <img key={item.id} src={item.src} alt=""/>
                        )
                    })
                    }
                </div>
            </div>
        );
    }
}


export default App;
