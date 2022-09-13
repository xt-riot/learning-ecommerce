import React, { Component } from 'react';
import { Card } from '@mui/material';
import './Product.css';
import {
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
} from '@mui/material';

export default class Product extends Component {
  render() {
    return (
      <div>
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component='img'
              height='250'
              image='/static/images/cards/contemplative-reptile.jpg'
              alt='green iguana'
            />
            <CardContent>
              <Typography
                gutterBottom
                variant='h5'
                align='center'
                component='div'
              >
                {this.props.title}
              </Typography>
              <Typography gutterBottom variant='h6' component='div'>
                Price: {this.props.price}€
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {this.props.desc}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );
  }
}
