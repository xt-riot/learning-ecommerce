import React, { Component } from 'react';
import Product from './Product';
import './Products.css';
import { Grid } from '@mui/material';
import img1 from '/jacket.jpg';
import img2 from '/puffer.jpg';
import img3 from '/shirt.jpg';
import img4 from '/pants.jpg';
import img5 from '/hat.jpg';
import img6 from '/shoes.jpg';

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
          img: img1,
        },
        {
          id: 2,
          title: 'Puffer',
          price: 80,
          quantity: 0,
          desc: 'This is a dummy desc for the puffer item.',
          img: img2,
        },
        {
          id: 3,
          title: 'Shirt',
          price: 30,
          quantity: 0,
          desc: 'This is a dummy desc for the shirt item.',
          img: img3,
        },
        {
          id: 4,
          title: 'Pants',
          price: 40,
          quantity: 0,
          desc: 'This is a dummy desc for the pants item.',
          img: img4,
        },
        {
          id: 5,
          title: 'Hat',
          price: 25,
          quantity: 0,
          desc: 'This is a dummy desc for the hat item.',
          img: img5,
        },
        {
          id: 6,
          title: 'Shoes',
          price: 70,
          quantity: 0,
          desc: 'This is a dummy desc for the shoes item.',
          img: img6,
        },
      ],
    };
  }

  // componentDidMount = async () => {
  //   try {
  //    const response = await fetch("", {
  //     method: "GET",
  //   });
  //     const data = await response.json();
  //     this.setState({
  //       data: data,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  handleIncrement = (item, maxValue) => {
    const allData = [...this.state.data];
    const id = allData.indexOf(item);

    if (allData[id].quantity < maxValue) {
      allData[id].quantity++;
      this.setState({ data: allData });
    }
  };

  handleDecrement = (item, minValue) => {
    const allData = [...this.state.data];
    const id = allData.indexOf(item);

    if (allData[id].quantity < minValue) {
      allData[id].quantity--;
      this.setState({ data: allData });
    }
  };

  render() {
    return (
      <div className='itemsTotal'>
        <h2 className='productsTitle'>Products</h2>
        <Grid container spacing={10}>
          {this.state.data.map((item) => {
            return (
              <Grid item md={4} key={item.id} align='center'>
                <Product
                  key={item.id}
                  title={item.title}
                  price={item.price}
                  quantity={item.quantity}
                  desc={item.desc}
                  img={item.img}
                  item={this.item}
                  onIncrement={this.handleIncrement}
                  onDecrement={this.handleDecrement}
                ></Product>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}
