import React from 'react';

const SubCategory = ({ complete_data }) => {
  console.log(complete_data);
  return <ol className="list-disc">{complete_data && <Item data={complete_data} />}</ol>;
};

export default SubCategory;

const Item = ({ data }) => {
  return (
    <li className="ml-10">
      {data.list_name}
      {data.nest_list.length > 0 && (
        <ul>
          <li>{data.nest_name}</li>
          {data.nest_list.map((x, index) => (
            <Item key={index} data={x} />
          ))}
        </ul>
      )}
    </li>
  );
};
