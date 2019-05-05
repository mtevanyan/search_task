import React, {Component} from 'react';

import {Draggable} from "react-drag-and-drop";

class SearchingPhotos extends Component {

    render() {
        return (
            <div className="photo-wrapper">
                {
                    this.props.photos.map((photo) => {
                        return (
                            <Draggable className="photo-item"
                                       type={photo.type}
                                       data={photo.id}
                                       key={photo.id}>
                                <img alt={photo.type} src={photo.src}/>
                            </Draggable>
                        )
                    })
                }
            </div>
        );
    }
}

export default SearchingPhotos;
