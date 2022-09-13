import React, { Component } from 'react';
import Product from './Product';
import './Products.css';
import { Box, Grid } from '@mui/material';
import './src/assets';

export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          title: 'Jacket',
          price: 80,
          quantity: 0,
          desc: 'This is a dummy desc for the jacket item.',
          img: '',
        },
        {
          id: 2,
          title: 'Puffer',
          price: 80,
          quantity: 0,
          desc: 'This is a dummy desc for the puffer item.',
          img: '',
        },
        {
          id: 3,
          title: 'Shirt',
          price: 30,
          quantity: 0,
          desc: 'This is a dummy desc for the shirt item.',
          img: '',
        },
        {
          id: 4,
          title: 'Pants',
          price: 40,
          quantity: 0,
          desc: 'This is a dummy desc for the pants item.',
          img: '',
        },
        {
          id: 5,
          title: 'Hat',
          price: 25,
          quantity: 0,
          desc: 'This is a dummy desc for the hat item.',
          img: '',
        },
        {
          id: 6,
          title: 'Shoes',
          price: 70,
          quantity: 0,
          desc: 'This is a dummy desc for the shoes item.',
          img: '',
        },
      ],
    };
  }
  render() {
    return (
      <div className='itemsTotal'>
        <h3>Products</h3>
        <Box md={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid container item spacing={1}>
              {this.state.data.map((item) => {
                return (
                  <Product
                    key={item.id}
                    title={item.title}
                    price={item.price}
                    quantity={item.price}
                    desc={item.desc}
                  ></Product>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </div>
    );
  }
}
