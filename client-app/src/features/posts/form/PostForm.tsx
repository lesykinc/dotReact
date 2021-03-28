﻿import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { PostFormValues } from '../../../app/models/post';
import { useRef } from 'react';
// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {date} from "yup";


export default observer(function PostForm() {
    const history = useHistory();
    const { postStore } = useStore();
    const { createPost, updatePost, loadPost, loadingInitial } = postStore;
    const { id } = useParams<{ id: string }>();

    const [post, setPost] = useState<PostFormValues>(new PostFormValues());
    const [isEditorChanged, setIsEditorChanged] = useState(false);
    
    let myEditor: any;

    const validationSchema = Yup.object({
        title: Yup.string().required('The post title is required'),
        date: Yup.string().required('Date is required').nullable(),
        content: Yup.string().required(),
    })

    useEffect(() => {
        if (id) loadPost(id).then(post => setPost(new PostFormValues(post)))
    }, [id, loadPost]);

    function handleFormSubmit(post: PostFormValues) {
        post.content = myEditor.getData()
        if (!post.id) {
            let newPost = {
                ...post,
                id: uuid()
            };
            createPost(newPost).then(() => history.push(`/posts/${newPost.id}`))
        } else {
            updatePost(post).then(() => history.push(`/posts/${post.id}`))
        }
    }
   
    if (loadingInitial) return <LoadingComponent content='Loading post...' />

    return (
        <Segment style={ {width: 700, margin: '0 auto'} } clearing >
            <Header content='Post Details' sub color='teal' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={post}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form  className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Title' />
                        
                        <CKEditor
                            editor={ClassicEditor}
                            onReady={(editor: any) => {
                                myEditor = editor;
                                editor.setData(post.content)
                                }}
                        />
                        
                        <Button
                            disabled={isSubmitting || (!dirty && isEditorChanged) || !isValid}
                            // disabled={isSubmitting || !dirty || !isValid}
                            floated='right'
                            positive type='submit' content='Submit' />
                        <Button as={Link} to='/posts' floated='right' type='button' content='Back' />
                    </Form>
                )}
            </Formik>

        </Segment>
    )
})