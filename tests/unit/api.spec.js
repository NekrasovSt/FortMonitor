import {getData, transformToTree} from '../../src/services/api';
import moxios from 'moxios';
import {groups, companies, objects} from '../data/test-data';

describe('api.js', () => {
  beforeEach(function() {
    moxios.install();
  });

  afterEach(function() {
    moxios.uninstall();
  });
  it('строим древовидную структуру', () => {
    let result = transformToTree(companies.companies,
        groups.groups,
        objects.objects);

    expect(result.length).toBe(1);
    expect(result[0].data.type).toBe('company');

    expect(result[0].children.length).toBe(1);
    expect(result[0].children[0].data.type).toBe('group');

    expect(result[0].children[0].children[0].children.length).toBe(4);
    expect(result[0].children[0].children[0].children[2].data.type).
        toBe('object');

  });
  it('запрос авторизации в начале', done => {
    getData();
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      expect(request.url).
          toBe(
              'http://uae.fort-monitor.ru/api/integration/v1/connect?login=ApiTest&password=ApiTest&lang=ru-ru&timezone=0');
      done();
    });
  });
  it('авторизия не прошла, другие запросы не выполняем', done => {
    let result = getData();
    moxios.stubRequest(/connect/, {
      status: 401,
      responseText: 'error',
    });
    result.catch(err => {
      setTimeout(() => {
        expect(moxios.requests.count()).toBe(1);
        done();
      }, 1000);
    });
  });
  it('авторизия прошла, другие запросы выполняем', done => {
    let result = getData();
    moxios.stubRequest(/connect/, {
      status: 200,
      response: {},
    });
    moxios.stubRequest(/getcompanieslist/, {
      status: 200,
      response: companies,
    });
    moxios.stubRequest(/getobjectgroupslist/, {
      status: 200,
      response: groups,
    });
    moxios.stubRequest(/getobjectslist/, {
      status: 200,
      response: objects,
    });
    result.then(err => {
      setTimeout(() => {
        expect(moxios.requests.count()).toBe(4);
        done();
      }, 1000);
    });
  });
});
