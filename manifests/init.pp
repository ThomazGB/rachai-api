class mongodb {
  package { 'mongodb':
    ensure => installed,
  }

  service { 'mongodb':
    ensure     => running,
    enable     => true,
    require    => Package['mongodb'],
  }

  file { './init-mongo.js':
    ensure  => file,
    source  => 'puppet:///modules/mongodb/init-mongo.js',
    require => Package['mongodb'],
  }

  exec { 'init_mongo':
    command => 'mongo /path/to/init-mongo.js',
    path    => ['/bin', '/usr/bin'],
    require => [Service['mongodb'], File['./init-mongo.js']],
  }
}