import React, { Component } from 'react';
import { Card, Button } from '@mui/material';
import './Product.css';
import { CardContent, CardMedia, Typography } from '@mui/material';

export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: this.props.item,
    };
  }
  handleIncrement = () => {
    console.log('+');
  };

  handleDecrement = () => {
    console.log('-');
  };

  render() {
    return (
      <div>
        <Card sx={{ maxWidth: 345 }}>
          <Card sx={{ bgcolor: '#cfd8dc' }}>
            <CardMedia
              component='img'
              height='400'
              image={this.props.img}
              alt='This is an item image.'
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
            <Typography>
              <div className='qntyContainer'>
                <div className='quantity'>
                  <span>{this.props.quantity}</span>
                  <div className='btn-grp'>
                    <Button
                      onClick={() => {
                        this.props.onIncrement(this.state.product, 10);
                      }}
                      variant='outlined'
                      style={{
                        fontSize: '14px',
                        padding: '3px',
                      }}
                      className='plus'
                    >
                      +
                    </Button>
                    <Button
                      onClick={() => {
                        this.props.onDecrement(this.state.product, 0);
                      }}
                      variant='outlined'
                      style={{
                        fontSize: '14px',
                        padding: '3px',
                      }}
                      className='plus'
                    >
                      -
                    </Button>
                  </div>
                </div>
                <Button
                  style={{
                    fontSize: '12px',
                  }}
                  variant='contained'
                >
                  Add to cart
                </Button>
              </div>
            </Typography>
          </Card>
        </Card>
      </div>
    );
  }
}
