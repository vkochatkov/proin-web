import { Grid, Paper, Skeleton } from '@mui/material';

interface IProps {}

export const CommentSceleton: React.FC<IProps> = () => {
  return (
    <Paper
      className='disable-text-selection'
      style={{ padding: '20px', marginTop: '1rem' }}
    >
      <Grid container direction='row' alignItems='center'>
        <Skeleton animation='wave' variant='circular' width={20} height={20} />
        <Skeleton
          animation='wave'
          height={20}
          width='50%'
          style={{ marginLeft: 20 }}
        />
      </Grid>
      <Skeleton
        animation='wave'
        height={20}
        width='80%'
        style={{ marginLeft: 5 }}
      />
    </Paper>
  );
};
