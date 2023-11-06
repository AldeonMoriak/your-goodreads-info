import Link from 'next/link';

export default function BookCard({ book }: { book: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 m-2">
      <div className="bg-yellow-200 h-32 w-full rounded-md mb-2"></div>
      <h2 className="text-lg font-semibold text-gray-800" dir="auto">
        {book.title}
      </h2>
      <Link href={'/authors/' + book.author}>
        <p className="text-sm text-gray-600" dir="auto">
          {book.authors?.name}
        </p>
      </Link>
      {book.page_number ? <p className="text-sm text-gray-600">{book.page_number} pages</p> : null}
      <div
        className="flex"
        aria-label={`Average rating of ${book.average_rating} stars.`}
        role="figure"
      >
        <span aria-hidden="true">
          <span
            aria-label={`Rating ${book.average_rating} out of 5`}
            role="img"
            className="inline-flex"
          >
            {Array.from({ length: Math.round(book.average_rating) }, (_, index) => index).map(
              (_, index) => (
                <span className="h-5 w-5 p-0.5" key={index}>
                  <svg viewBox="0 0 24 24" role="presentation">
                    <path
                      className="fill-orange-500"
                      d="M24 9.63469C24 9.35683 23.7747 9.13158 23.4969 9.13158H15.0892L12.477 1.34327C12.4269 1.19375 12.3095 1.0764 12.16 1.02625C11.8966 0.937894 11.6114 1.07983 11.523 1.34327L8.91088 9.13158H0.503157C0.33975 9.13158 0.186521 9.21094 0.0922364 9.3444C-0.0680877 9.57134 -0.0140806 9.88529 0.212865 10.0456L7.00408 14.8432L4.40172 22.6166C4.35092 22.7683 4.37534 22.9352 4.46749 23.066C4.6275 23.2932 4.94137 23.3476 5.16853 23.1876L12 18.3758L18.8317 23.183C18.9625 23.2751 19.1293 23.2994 19.281 23.2486C19.5445 23.1604 19.6865 22.8752 19.5983 22.6117L16.996 14.8432L23.7872 10.0456C23.9206 9.95133 24 9.7981 24 9.63469Z"
                    ></path>
                  </svg>
                </span>
              )
            )}
            {Array.from({ length: 5 - Math.round(book.average_rating) }, (_, index) => index).map(
              (_, index) => (
                <span className="h-5 w-5 p-0.5 opacity-30" key={index}>
                  <svg viewBox="0 0 24 24" role="presentation">
                    <defs>
                      <clipPath id="clip_RatingStar_undefined-0.009999999999999787medium">
                        <path d="M24 9.63469C24 9.35683 23.7747 9.13158 23.4969 9.13158H15.0892L12.477 1.34327C12.4269 1.19375 12.3095 1.0764 12.16 1.02625C11.8966 0.937894 11.6114 1.07983 11.523 1.34327L8.91088 9.13158H0.503157C0.33975 9.13158 0.186521 9.21094 0.0922364 9.3444C-0.0680877 9.57134 -0.0140806 9.88529 0.212865 10.0456L7.00408 14.8432L4.40172 22.6166C4.35092 22.7683 4.37534 22.9352 4.46749 23.066C4.6275 23.2932 4.94137 23.3476 5.16853 23.1876L12 18.3758L18.8317 23.183C18.9625 23.2751 19.1293 23.2994 19.281 23.2486C19.5445 23.1604 19.6865 22.8752 19.5983 22.6117L16.996 14.8432L23.7872 10.0456C23.9206 9.95133 24 9.7981 24 9.63469Z"></path>
                      </clipPath>
                      <path
                        id="path_RatingStar_undefined-0.009999999999999787medium"
                        d="M24 9.63469C24 9.35683 23.7747 9.13158 23.4969 9.13158H15.0892L12.477 1.34327C12.4269 1.19375 12.3095 1.0764 12.16 1.02625C11.8966 0.937894 11.6114 1.07983 11.523 1.34327L8.91088 9.13158H0.503157C0.33975 9.13158 0.186521 9.21094 0.0922364 9.3444C-0.0680877 9.57134 -0.0140806 9.88529 0.212865 10.0456L7.00408 14.8432L4.40172 22.6166C4.35092 22.7683 4.37534 22.9352 4.46749 23.066C4.6275 23.2932 4.94137 23.3476 5.16853 23.1876L12 18.3758L18.8317 23.183C18.9625 23.2751 19.1293 23.2994 19.281 23.2486C19.5445 23.1604 19.6865 22.8752 19.5983 22.6117L16.996 14.8432L23.7872 10.0456C23.9206 9.95133 24 9.7981 24 9.63469Z"
                      ></path>
                    </defs>
                    <use
                      clipPath="url(#clip_RatingStar_undefined-0.009999999999999787medium)"
                      href="#path_RatingStar_undefined-0.009999999999999787medium"
                      className="RatingStar__backgroundFill"
                    ></use>
                  </svg>
                </span>
              )
            )}
          </span>
        </span>
        <div className="flex" aria-hidden="true">
          <span className="pr-1">{book.average_rating} </span>
          {book.user_book[0]?.rating ? (
            <div className="flex justify-center items-center">
              (
              <span className="h-4 w-4 p-0.5">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path
                    className="fill-orange-500"
                    d="M24 9.63469C24 9.35683 23.7747 9.13158 23.4969 9.13158H15.0892L12.477 1.34327C12.4269 1.19375 12.3095 1.0764 12.16 1.02625C11.8966 0.937894 11.6114 1.07983 11.523 1.34327L8.91088 9.13158H0.503157C0.33975 9.13158 0.186521 9.21094 0.0922364 9.3444C-0.0680877 9.57134 -0.0140806 9.88529 0.212865 10.0456L7.00408 14.8432L4.40172 22.6166C4.35092 22.7683 4.37534 22.9352 4.46749 23.066C4.6275 23.2932 4.94137 23.3476 5.16853 23.1876L12 18.3758L18.8317 23.183C18.9625 23.2751 19.1293 23.2994 19.281 23.2486C19.5445 23.1604 19.6865 22.8752 19.5983 22.6117L16.996 14.8432L23.7872 10.0456C23.9206 9.95133 24 9.7981 24 9.63469Z"
                  ></path>
                </svg>
              </span>
              <span>{book.user_book[0]?.rating}</span>)
            </div>
          ) : null}
        </div>
      </div>
      {book.original_publication_year ? (
        <p className="text-sm text-gray-600">
          originally published on {book.original_publication_year}
        </p>
      ) : null}
      {book.user_book[0]?.date_added ? (
        <p className="text-sm text-gray-600">
          added on {new Date(book.user_book[0]?.date_added).toLocaleDateString()}
        </p>
      ) : null}
    </div>
  );
}
