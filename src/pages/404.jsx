import Nav from '../components/global/navs/nav';
import Page from '../components/page';

export default function NotFound() {
  return (
    <Page
      title="Page Not Found"
      description="Please check the URL address again."
    >
      <div className="min-h-screen">
        <Nav />
        <div className="bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="max-w-max mx-auto">
            <main className="sm:flex">
              <p className="text-4xl font-semibold text-gray-700 sm:text-5xl">
                404
              </p>
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-gray-400 sm:pl-6">
                  <h1 className="text-4xl font-semibold text-gray-700 tracking-tight sm:text-5xl">
                    Page not found
                  </h1>
                  <p className="mt-1 text-base text-gray-500">
                    Please check the URL in the address bar and try again.
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Page>
  );
}
