import PageTitle from '@/components/PageTitle'
import React from 'react'
import EventForm from '../_components/event-form'

function NewEventsPage() {
  return (
    <div className="bg-white p-5">
      <PageTitle title="New Museum" />

      <div className="mt-5 bg-white p-5">
        <EventForm />
      </div>
    </div>
  );
}

export default NewEventsPage