module.exports = (req, res) => {
  return res.render('manager/late_bus', {
    page: 'manager/late_bus',
    title: 'Late Bus Registrations',
    includes: {
      external: {
        css: ['fontawesome', 'general', 'header', 'logo', 'page', 'partials']
      }
    },
    late_bus_registrations: [
      {
        destination: 'Zorlu, Akmerkez',
        user: {
          name: 'Yunus Gürlek',
          email: 'ygurlek22@my.uaa.k12.tr',
          number: 315
        }
      },
      {
        destination: 'Zorlu, Akmerkez',
        user: {
          name: 'Yunus Gürlek',
          email: 'ygurlek22@my.uaa.k12.tr',
          number: 315
        }
      },
      {
        destination: 'Zorlu, Akmerkez',
        user: {
          name: 'Yunus Gürlek',
          email: 'ygurlek22@my.uaa.k12.tr',
          number: 315
        }
      }
    ],
    manager: req.session.manager
  });
}
