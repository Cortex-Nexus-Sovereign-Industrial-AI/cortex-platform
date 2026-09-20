/** Shared member-area nav helper — include on member pages */
(function () {
  if (typeof document === 'undefined') return;
  var links = [
    { href: 'index.html', label: 'Dashboard' },
    { href: 'directory.html', label: 'Directory' },
    { href: 'profile.html', label: 'Profile' },
    { href: 'success.html', label: 'After payment' }
  ];
  var path = (location.pathname || '').split('/').pop() || 'index.html';
  var nav = document.getElementById('member-nav');
  if (!nav) return;
  nav.innerHTML = links
    .map(function (l) {
      var active = path === l.href || (path === '' && l.href === 'index.html');
      return (
        '<a href="' +
        l.href +
        '" style="color:' +
        (active ? '#00d4ff' : '#a0aec0') +
        ';text-decoration:none;font-size:0.85rem;margin-right:14px;font-weight:' +
        (active ? '700' : '500') +
        ';">' +
        l.label +
        '</a>'
      );
    })
    .join('');
})();
