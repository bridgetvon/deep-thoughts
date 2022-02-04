import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Query_THOUGHT } from '../utils/queries';
import ReactionList from '../components/ReactionList';

const SingleThought = props => {
  const { id: thoughtId } = useParams();
  //give use query hook a second argument of an object, this is how you can pas variables to queries that need them 
  const { loading, data } = useQuery(Query_THOUGHT, {
    variables: { id: thoughtId }
  });
  const thought = data?.thought || {};

  if(loading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>
      {/* add the reaction list as a component and pass the reactions array as a prop. combin this with thought.reactioncount > 0 to prevent rendering reactions if the array is empty  */}
      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
    </div>
  );
};

export default SingleThought;
