import { Container, Card, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Card style={{ padding: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Bienvenido al sistema de Presupuesto Personal
        </Typography>
      </Card>
    </Container>
  );
};

export default Home;
