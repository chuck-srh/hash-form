import React from "react";
import "./Section.css";
import Section from './Section';
import axios from 'axios';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

const sectionInfo = [
  {
    title: 'Section A',
    key: 'sectionA',
    fields: [
      {
        key: 'fieldA1',
        title: 'Field A1'
      },
      {
        key: 'fieldA2',
        title: 'Field A2'
      }
    ]
  },
  {
    title: 'Section B',
    key: 'sectionB',
    fields: [
      {
        key: 'fieldB1',
        title: 'Field B1'
      },
      {
        key: 'fieldB2',
        title: 'Field B2'
      }
    ]
  }
]

const id = '8ddb2069-6001-49d2-bf27-12d17ceefa40';
const url = 'http://localhost:3000/section/' + id;

const Sections = () => {

  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const { isLoading, error, data, isFetching } = useQuery({ 
    keepPreviousData : true,
    queryKey: ['sections'], 
    queryFn: () => 
      axios.get(url)
      .then((res) => res.data)
    })

  // Mutations
  const mutation = useMutation({
    mutationFn: (sectionSave) => {
      return axios.post(url, sectionSave);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    },
    onError: (err, value) => {
    }
  })  

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message  
  
  return (
    <>
    {sectionInfo.map((section,index) => {
      return (
        <Section 
          key={index}
          section={section}
          data={data[section.key]}
          hashval={data[`${section.key}Hash`]}
          mutation={mutation}/>
      )
    })}
    </>
  );
};

export default Sections;
