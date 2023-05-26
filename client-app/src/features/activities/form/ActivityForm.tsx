import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Button, Header, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/stores';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ActivityFormValues } from '../../../app/models/activity';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import {v4 as uuid} from 'uuid';

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const { createActivity, updateActivty, loadActivity, loadingInitial } = activityStore;
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is requred!'),
    description: Yup.string().required('The activity description is requred!'),
    category: Yup.string().required('The activity category is requred!'),
    date: Yup.string().required('The activity date is requred!').nullable(),
    venue: Yup.string().required('The activity venue is requred!'),
    city: Yup.string().required('The activity city is requred!'),
  })

  useEffect(() => {
    if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
  }, [id, loadActivity])

  function handleFormSubmit(activity: ActivityFormValues) {
    if (!activity.id) {
        let newActivity = {
          ...activity,
          id: uuid()
        };
      createActivity(newActivity).then(() => navigate(`/activities/${newActivity.id}`))
    } else {
      updateActivty(activity).then(() => navigate(`/activities/${activity.id}`))
    }
  }

  if (loadingInitial) return <LoadingComponent content='Loading Activity...' />
  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal' />
      <Formik 
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity} 
        onSubmit={values => handleFormSubmit(values)}>
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <MyTextInput name='title' placeholder='Title' />
            <MyTextArea row={3} name='description' placeholder='Description' />
            <MySelectInput options={categoryOptions} name='category' placeholder ='Category' />
            <MyDateInput 
              name='date' 
              placeholderText ='Date' 
              showTimeSelect
              timeCaption='time'  
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <Header content='Location Details' sub color='teal' />
            <MyTextInput name='city' placeholder ='City' />
            <MyTextInput name='venue' placeholder ='Venue' />
            <Button 
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting} 
              floated='right' 
              positive type='submit' 
              content='Submit' />
            <Button as={Link} to='/activities' floated='right' type='submit' content='Cancel' />
          </Form>
        )}
        </Formik>
    </Segment>
  )
})
