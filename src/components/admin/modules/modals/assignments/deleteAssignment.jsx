import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { TrashIcon, XIcon } from '@heroicons/react/solid';
import { database } from '../../../../../firebase';
import { useParams } from 'react-router-dom';
import printError from '../../../../../utility/printError';
import Loading from '../loading';

export default function DeleteAssignmentModal(props) {
  const [loading, setLoading] = useState(false);
  const { course } = useParams();
  async function deleteAssignment(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const users = await database.users.get();
      for (const doc of users.docs)
        await database.users
          .doc(doc.id)
          .collection('courses')
          .doc(course)
          .collection('modules')
          .doc(props.name)
          .collection('assignments')
          .doc(props.id)
          .delete();
      await props.data
        .doc(props.name)
        .collection('assignments')
        .doc(props.id)
        .delete();
      console.log('Assignment successfully deleted!');
      props.setOpen(false);
    } catch (err) {
      printError(err);
    }
    setLoading(false);
  }

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => !loading && props.setOpen(false)}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              {!loading ? (
                <div>
                  <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => props.setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100">
                      <TrashIcon
                        className="h-6 w-6 text-cyan-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Are you sure you want to delete this assignment?
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Deleting assignments is not a recoverable action. All
                          data will be immediately lost and cannot be accessed
                          in the future.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      disabled={loading}
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                      onClick={deleteAssignment}
                    >
                      Delete immediately
                    </button>
                  </div>
                </div>
              ) : (
                <Loading />
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
