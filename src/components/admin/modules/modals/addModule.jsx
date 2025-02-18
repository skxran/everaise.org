import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PencilIcon, XIcon } from '@heroicons/react/solid';
import { database } from '../../../../firebase';
import { useParams } from 'react-router-dom';
import printError from '../../../../utility/printError';
import Loading from './loading';

/*
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const settings = [
  { name: 'Not Disabled', description: 'Students will be able to access this module' },
  { name: 'Disabled', description: 'No student will be able to access this module' },
]
*/

export default function AddModuleModal(props) {
  const [loading, setLoading] = useState(false);
  const { course } = useParams();
  const [module, setModule] = useState({
    name: '',
    disabled: false
  });

  async function addModule(e) {
    e.preventDefault();
    try {
      setLoading(true);
      props.data.doc(`${module.name}`).set({
        name: module.name,
        disabled: module.disabled
      });
      const users = await database.users.get();
      users.docs.forEach((doc) => {
        database.users
          .doc(doc.id)
          .collection('courses')
          .doc(course)
          .collection('modules')
          .doc(`${module.name}`)
          .set({
            name: module.name,
            disabled: module.disabled
          });
      });
      console.log('Module succesfully created!');
      props.setOpen(false);
      setModule({
        name: '',
        disabled: false
      });
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
                      <PencilIcon
                        className="h-6 w-6 text-cyan-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Create module
                      </Dialog.Title>
                    </div>
                  </div>
                  <form
                    className="mt-6 grid grid-cols-2 gap-6"
                    onSubmit={addModule}
                    method="POST"
                  >
                    <div className="col-span-2">
                      <label
                        htmlFor="question_id"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name{'*'}
                      </label>
                      <input
                        required
                        value={module.name}
                        onChange={(e) =>
                          setModule({ ...module, name: e.target.value })
                        }
                        placeholder="Enter module name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    {/*
                  <div className="col-span-2">
                    <label htmlFor="question_id" className="block text-sm font-medium text-gray-700">
                      Disabled{'*'}
                    </label>
                    <div className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <RadioGroup value={module.disabled ? settings[1] : settings[0]} onChange={e => setModule({ ...module, disabled: e.name === 'Disabled' })}>
                        <RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
                        <div className="">
                          {settings.map((setting, settingIdx) => (
                            <RadioGroup.Option
                              key={setting.name}
                              value={setting}
                              className={({ checked }) =>
                                classNames(
                                  settingIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                                  settingIdx === settings.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                                  checked ? 'bg-indigo-50 border-indigo-200' : '',
                                  'relative p-4 flex cursor-pointer focus:outline-none'
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <span
                                    className={classNames(
                                      checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
                                      active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                                      'h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center'
                                    )}
                                    aria-hidden="true"
                                  >
                                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                                  </span>
                                  <div className="rounded-md ml-3 flex flex-col">
                                    <RadioGroup.Label
                                      as="span"
                                      className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'block text-sm font-medium')}
                                    >
                                      {setting.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className={classNames(checked ? 'text-indigo-700' : 'text-gray-500', 'block text-sm')}
                                    >
                                      {setting.description}
                                    </RadioGroup.Description>
                                  </div>
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  */}
                    <button
                      disabled={loading}
                      type="submit"
                      className="col-span-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    >
                      Save module
                    </button>
                  </form>
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
