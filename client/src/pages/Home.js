import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';

const Home = () => {
  //usequery hook to make a query request 
  //loading allows us to conditionally render data based on whether or not there is data to display 
  const { loading, data } = useQuery(QUERY_THOUGHTS);
//use optional chainging this negates the need to check if an object exists before accessing its properties 
//if data exists store it in thoughts constant we created if it is undefined save an empty array of the thoughts component 
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
