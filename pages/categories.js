import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import { Card, Grid, Typography } from '@material-ui/core';
import NextLink from 'next/link';

const Categories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <Layout title='Browse Categories' selectedNavCategories>
      <Typography variant='h1' component='h1'>
        Browse Categories
      </Typography>
      <Grid container style={{ marginTop: '2rem' }} spacing={1}>
        {categories.map((category) => (
          <NextLink
            key={category}
            href={`/search?category=${category}`}
            passHref
          >
            <Grid
              item
              md={2}
              xs={6}
              style={{
                display: 'flex',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Card style={{ width: '10rem', height: '5rem', padding: '1rem' }}>
                <Typography variant='h4' style={{ margin: 0 }}>
                  <strong> {category}</strong>
                </Typography>
                <Typography
                  variant='h6'
                  style={{ margin: '10px 0 0 0', color: '#ff0000' }}
                >
                  VIEW&nbsp;ITEMS
                </Typography>
              </Card>
            </Grid>
          </NextLink>
        ))}
      </Grid>
    </Layout>
  );
};

export default Categories;
