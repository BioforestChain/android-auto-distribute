import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="flex items-center justify-center">
        <div className="card bg-base-100 w-96 shadow-xl ">
          <figure className="px-10 pt-10">
            <img
              src="/menu-background.webp"
              alt="background"
              className="rounded-xl"
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">404 - Page not found!</h2>
            <p>The page you were looking for doesn't exist.</p>
            <div className="card-actions">
              <a role="button" className="btn btn-primary" href="/">
                Go back home
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
