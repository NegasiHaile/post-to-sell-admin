import React from 'react';

// Material
import { Container, Card, Box } from '@mui/material';

// Components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import CategoryForm from '../components/Category/CategoryForm';

const AddCategory = () => {
  return (
    <Page title="Add category">
      <Container>
        <Card spacing={2}>
          <Scrollbar>
            <Box m={1} p={1}>
              {/* A form to add category */}
              <CategoryForm />
            </Box>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
};

export default AddCategory;
