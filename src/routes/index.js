import {
  LoginPage,
  EventsPage,
  EventPage,
  Page404
} from '../pages';


export default function (baseRouter) {
  return baseRouter ? (
    [
      {
        path: `/login`,
        key: 'login',
        component: LoginPage,
        exact: true,
      },
      {
        path: `/`,
        key: 'front',
        component: EventsPage,
        exact: true,
      },
      {
        path: `/${baseRouter}`,
        key: 'frontUser',
        component: EventsPage,
        exact: true,
      },
      {
        path: `/${baseRouter}/event/:eventSlug`,
        key: 'event',
        component: EventPage,
        exact: true,
      },
      {
        path: `/404`,
        key: 'page404',
        component: Page404,
      },
      {
        path: `/${baseRouter}/404`,
        key: 'page404User',
        component: Page404,
      },
      {
        path: `*`,
        key: 'page404All',
        component: Page404,
      }
    ]
  ) : (
    [
      {
        path: `/login`,
        key: 'login',
        component: LoginPage,
        exact: true,
      },
      {
        path: `*`,
        key: 'page404All',
        component: Page404,
      }
    ]
  )
}
