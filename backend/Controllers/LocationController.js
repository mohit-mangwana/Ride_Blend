import axios from 'axios';

export const geoCode =  async (req, res) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          format: 'json',
          q: req.query.q
        }
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).send('Error fetching data');
    }
  };