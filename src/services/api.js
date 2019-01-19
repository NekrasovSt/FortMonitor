import axios from 'axios';

export function getData() {
  return axios.get(
      `http://uae.fort-monitor.ru/api/integration/v1/connect?login=ApiTest&password=ApiTest&lang=ru-ru&timezone=0`).
      then(response => {
        return Promise.all([
          axios.get(
              'http://uae.fort-monitor.ru/api/integration/v1/getcompanieslist'),
          axios.get(
              'http://uae.fort-monitor.ru/api/integration/v1/getobjectgroupslist'),
          axios.get(
              'http://uae.fort-monitor.ru/api/integration/v1/getobjectslist')]);
      }).then(result => {
        return transformToTree(result[0].data.companies, result[1].data.groups,
            result[2].data.objects);
      });
}

export function transformToTree(companies, groups, objects) {
  companies = companies.map(i => {
    let obj = {
      text: i.name,
      data: i,
      children: [],
    };
    obj.data.type = 'company';
    return obj;
  });
  let groupDictionary = {};
  groups = groups.map(i => {
    let obj = {
      text: i.name,
      data: i,
      children: [],
    };
    obj.data.type = 'group';
    groupDictionary[i.id] = obj;
    return obj;
  });
  let roots = [];
  groups.forEach(i => {
    if (i.data.parentGroupId == 0) {
      roots.push(i);
    } else
      groupDictionary[i.data.parentGroupId].children.push(i);
  });
  objects.forEach(i => {
    let obj = {
      text: i.name,
      data: i,
      children: [],
    };
    obj.data.type = 'object';
    groupDictionary[i.groupId].children.push(obj);
  });
  companies.forEach(company => {
    let group = roots.find(j => j.data.companyId === company.data.id);
    if (group)
      company.children.push(group);
  });
  return companies;
}

