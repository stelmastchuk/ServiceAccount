# -*- coding: utf-8 -*-
import json, time, datetime, subprocess, os, argparse, base64, platform
import requests
import urllib3
from urllib.parse import urlencode

def _branchName():
  result = subprocess.check_output('git rev-parse --abbrev-ref HEAD', shell=True)
  return (result.strip())

def _unstagedCommits():
  result = subprocess.check_output('git status --porcelain=v1 | wc -l', shell=True)
  return (result.strip())

http = urllib3.PoolManager()

branch_name = _branchName().decode('utf-8')

unstagedCommits = _unstagedCommits()

my_os=platform.processor()

startTime= datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%S")

class bcolors:
  HEADER = '\033[95m'
  OKBLUE = '\033[94m'
  OKGREEN = '\033[92m'
  WARNING = '\033[93m'
  FAIL = '\033[91m'
  ENDC = '\033[0m'
  BOLD = '\033[1m'
  UNDERLINE = '\033[4m'

def log_step(step_description, color = bcolors.HEADER):
  def inner(func):
    def wrapper(*args):
      task_name = args[0].task_name
      print(color + '[' + task_name  + '] - ' + step_description + bcolors.ENDC)
      return func(*args)
    return wrapper
  return inner

class Docker:
  task_name = 'Docker'

  def __init__(self, name, recreate):
    self.name = name
    self.recreate = recreate

  @log_step('Iniciando container do SonarQube no Docker', bcolors.OKBLUE)
  def run(self):
    recreate = self.recreate

    if recreate:
      self._recreate()
    else:
      self._start()

  @log_step('Verificando container do SonarQube', bcolors.OKBLUE)
  def _start(self):
    container_exists = self._exists()
    container_is_running = self._is_running()

    if (not container_exists):
      self._up(first_time=True)
    elif (container_exists and not container_is_running):
      self._up(first_time=False)

  @log_step('Recriando container do SonarQube')
  def _recreate(self):
    container_exists = self._exists()

    if (container_exists):
      self._rm()

    self._up(first_time=True)

  @log_step('Removendo container com status exited', bcolors.WARNING)
  def _rm(self):
    subprocess.check_output('docker rm --force ' + self.name, shell=True)

  def _up(self, first_time):
    if(first_time == False):
      subprocess.check_output('docker start ' + self.name, shell=True)
    else:
      arch_type = input('A arquitetura do seu computador é AMD64 (processadores intel e amd) ? [y/n]\n').upper()
      if(first_time and arch_type  in ['N', "NO"]):
        subprocess.check_output('docker run -d -p 9000:9000 --name ' + self.name + ' mwizner/sonarqube:8.9.5-community', shell=True)
      elif (first_time):
        subprocess.check_output('docker run -d -p 9000:9000 --name ' + self.name + ' sonarqube:8.9.7-community', shell=True)


  def _exists(self):
    result = subprocess.check_output('docker ps -a -f name=sonarqube -q', shell=True)

    return bool(result)

  def _is_running(self):
    result = subprocess.check_output('docker ps -a -f name=sonarqube -q -f status=running', shell=True)

    return bool(result)

class DefaultQualityGateConditions(object):
  conditions = [
    {
      'error': 0,
      'metric': 'new_code_smells',
      'op': 'GT'
    },
    {
      'error': 80,
      'metric': 'new_coverage',
      'op': 'LT'
    },
    {
      'error': 0.5,
      'metric': 'new_duplicated_lines_density',
      'op': 'GT'
    },
    {
      'error': 0,
      'metric': 'new_bugs',
      'op': 'GT'
    },
    {
      'error': 0,
      'metric': 'new_vulnerabilities',
      'op': 'GT'
    },
  ]

class QualityGate(DefaultQualityGateConditions):
  def auth_sonar(self):
    subprocess.check_output(
      'curl -u admin:admin -X POST "http://localhost:9000/api/users/change_password?login=admin&previousPassword=admin&password=sonar"',
      shell=True
    )

  def create_quality_gate(self):
    quality_gate = self._get_quality_gate()

    if (quality_gate):
      self._remove_conditions(quality_gate)
    else:
      quality_gate = self._insert_quality_gate()

    self._set_default_quality_gate(quality_gate)

    self._insert_conditions(quality_gate)

  def _post(self, url, payload = {}):
    data = urlencode(payload)
    encode = f"{self.username}:{self.password}"
    base64string = base64.b64encode(encode.encode('ascii'))
    url = self.base_url + f"{url}" + data
    response = http.request('POST',url, headers={"Authorization":f"Basic {base64string.decode('utf-8')}"})
    retorno = json.loads(response.data.decode("utf-8"))
    if (response.status == 204):
      return {}
    return retorno

  def _insert_quality_gate(self):
    url = 'api/qualitygates/create?'
    return self._post(url, {'name': self.component})

  def _remove_conditions(self, quality_gate):
    url = 'api/qualitygates/delete_condition'
    for condition in quality_gate['conditions']:
      self._post(url, condition)

  def _get_quality_gate(self):
    list_url = 'api/qualitygates/list'
    show_url = 'api/qualitygates/show?'

    try:
      response = self._post(list_url)
      quality_gate = list(filter(lambda quality_gate: quality_gate['name'] == self.component, response['qualitygates']))
      return self._post(show_url, {'id': quality_gate[0]['id']})
    except:
      return False

  def _set_default_quality_gate(self, quality_gate):
    url = 'api/qualitygates/set_as_default'
    return self._post(url, {'id': quality_gate['id']})

  def _exists(self):
      pass

  def _merge_dicts(self, x, y):
    z = x.copy()
    z.update(y)
    return z

  def _insert_conditions(self, quality_gate):
    url = 'api/qualitygates/create_condition?'
    gate_data = { 'gateId': quality_gate['id'] }
    conditions = map(lambda condition: self._merge_dicts(condition, gate_data), self.conditions)
    for condition in conditions:
      self._post(url, condition)

class SonarQube(QualityGate):
  task_name = 'SonarQube'

  def __init__(self, **kwargs):
    self.base_url = kwargs['base_url']
    self.username = kwargs['username']
    self.component = kwargs['component']
    self.password = kwargs['password']

  def _is_available(self):
    try:
      url = self.base_url + "api/server/version"
      response = requests.get(url)
      return response.status_code == 200
    except:
      return False

  @log_step('Aguardando a finalização da sincronização', bcolors.WARNING)
  def _is_ready(self):
    try:
      url = self.base_url + "api/ce/activity_status?component=" + self.component
      encode = f"{self.username}:{self.password}"
      base64string = base64.b64encode(encode.encode('ascii'))
      response = http.request('GET',url, headers={"Authorization":f"Basic {base64string.decode('utf-8')}"})
      data = json.loads(response.data.decode("utf-8"))
      return not bool(data['pending']) and not bool(data['inProgress'])
    except:
      return False

  @log_step('Inserindo as credenciais e o quality gate no sonar.', bcolors.OKBLUE)
  def _init_quality_gate(self):
    while not self._is_available():
        time.sleep(5)
    try:
      self.auth_sonar()
      self.create_quality_gate()
    except:
      return None

  @log_step('Deletando projetos anteriores do SonarQube.', bcolors.OKBLUE)
  def _delet_old_versions(self):
    try:
      subprocess.check_output(
          'curl -u admin:sonar -X POST "http://localhost:9000/api/projects/delete?project=' + self.component + '"',
          shell=True
        )
    except:
      print(bcolors.FAIL + "Não foi possível apagar versões dos projetos no sonar. Recomendamos que o script seja executado novamente!")


  @log_step('Criando stash das modificações em preparação (caso existam).', bcolors.OKBLUE)
  def _create_stash(self):
    if( unstagedCommits != '0'):
      confirm_stash = input(bcolors.BOLD +'Você possui modificações não comitadas, deseja prosseguir (um stash será criado)? [y/n]\n').upper()
      if confirm_stash in ['S', 'Y', 'YES', 'SIM','']:
        subprocess.check_output(
          'git stash push -u -m "' + branch_name + startTime + '"',
          
          shell=True
        )
        return True
      else:
        print('Commit as alterações em preparação para rodar o script novamente, ou aceite a aplicação do stash.')
        return False
    else:
      return True


  @log_step('Alternando para a master e realizando o rebase. Digite sua SENHA, caso necessário!', bcolors.OKBLUE)
  def _switching_to_master(self, timeout=60, polltime=0.1):
    proc = None
    try:
      proc = subprocess.Popen(
        'git switch master && git pull origin master --rebase',
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        close_fds=True
      )
      deadline = time.time() + timeout
      while time.time() < deadline and proc.poll() == None:
        time.sleep(polltime)
      if proc.poll() == None:
        proc.kill()
        subprocess.check_output(
        'git switch master',
        
        shell=True
      )
        print(bcolors.FAIL + "Não foi possível realizar o rebase da master, verifique suas credenciais e se a VPN está conectada!")

    except:
      if proc.poll() == None:
        proc.kill()
      subprocess.check_output(
        'git switch master',
        
        shell=True
      )
      print(bcolors.FAIL + "Não foi possível realizar o rebase da master, verifique suas credenciais e se se a VPN está conectada!")

  @log_step('Executando os testes unitários da master(Isso irá demorar um pouco).', bcolors.OKBLUE)
  def _test_project_master(self):
    try:
      subprocess.check_output(
        'yarn test',
        
        shell=True
      )
    except:
      print(bcolors.FAIL + "A realização dos testes falhou, por favor execute os testes unitários e verifique a falha!")

  @log_step('Executando o sonar scanner da master.', bcolors.OKBLUE)
  def _scan_project_master(self):
    while not self._is_available():
      time.sleep(5)
    try:
      subprocess.check_output(
        'yarn sonar-scanner -Dsonar.scm.disabled="true" -Dsonar.host.url=' + self.base_url + ' -Dsonar.login="admin" -Dsonar.password="sonar" -Dsonar.projectKey=' + self.component + ' -Dsonar.projectVersion=master',
        
        shell=True
      )
    except:
      print(bcolors.FAIL + "Não foi possível realizar o sonar scanner da master, tente novamente!")

  @log_step('Alternando para a branch ' + branch_name + ' e aplicando o stash das modificações que estavam em preparação!', bcolors.OKBLUE)
  def _apply_stash(self):
    if(unstagedCommits == '0'):
      subprocess.check_output(
        'git switch ' + branch_name + '',
        shell=True
      )
    elif( unstagedCommits != '0'):
      try:
        subprocess.check_output(
          'git switch ' + branch_name + ' && git stash apply stash@{0}',
          shell=True
        )
      except:
        subprocess.check_output(
          'git switch ' + branch_name + '',
          
          shell=True
        )
        print(bcolors.FAIL + "Não foi possível aplicar a stash, verifique a última stash criada e faça o apply!")

  @log_step('Executando os testes unitários da branch ' + branch_name +' (Isso irá demorar um pouco).', bcolors.OKBLUE)
  def _test_project(self):
    try:
      subprocess.check_output(
        'yarn test',
        
        shell=True
      )
    except:
      print(bcolors.FAIL + "A realização dos testes falhou, por favor execute os testes unitários e verifique a falha!")

  @log_step('Executando o sonar scanner da branch '+ branch_name + '.', bcolors.OKBLUE)
  def _scan_project(self):
    while not self._is_available():
        time.sleep(5)
    try:
      subprocess.check_output(
        'yarn sonar-scanner -Dsonar.scm.disabled="true" -Dsonar.host.url=' + self.base_url + ' -Dsonar.login="admin" -Dsonar.password="sonar" -Dsonar.projectKey=' + self.component + ' -Dsonar.projectVersion=' + branch_name + '',
        
        shell=True
      )
    except:
      print(bcolors.FAIL + "Não foi possível realizar o sonar scanner da branch, tente novamente!")

  @log_step('Sonar executado com sucesso! Resultado da análise na porta 9000, login = admin e password = sonar', bcolors.OKGREEN)
  def _notify_sucess(self):
    print('Sucess')

  @property
  def analyze(self):
    self._init_quality_gate()
    self._delet_old_versions()
    confirm_stash = self._create_stash()
    if(confirm_stash == False):
      os._exit(0)
    elif(branch_name != 'master'):
      self._switching_to_master()
      self._test_project_master()
      self._scan_project_master()
      self._apply_stash()
      self._test_project()
      self._scan_project()
      self._notify_sucess()
    else:
      self._test_project_master()
      self._scan_project_master()

    while not self._is_ready():
      time.sleep(10)

    os._exit(0)

class Arguments:
  def __init__(self):
    self.parser = parser = argparse.ArgumentParser()
    self._init_args()

  def _init_args(self):
    self.parser.add_argument(
      '--sonar-url',
      help='Define a url do Sonarqube (Default: localhost:9000)',
      default='http://localhost:9000/'
    )

    self.parser.add_argument(
      '--sonar-user',
      help='Define a usuário do Sonarqube (Default: admin)',
      default='admin'
    )

    self.parser.add_argument(
      '--sonar-password',
      help='Define a senha do usuário do Sonarqube (Default: admin)',
      default='sonar'
    )

    self.parser.add_argument(
      '--no-docker',
      dest='docker',
      help='Não irá criar um container do SonarQube',
      action='store_false',
      default=True,
    )

    self.parser.add_argument(
      '--component',
      help='Chave do projeto no SonarQube',
      default='app-backend',
    )

    self.parser.add_argument(
      '--recreate',
      help='Define se um container limpo SonarQube deverá ser criado',
      action='store_true',
      default=False,
    )

  def get_args(self):
      return self.parser.parse_args()

if __name__ == "__main__":
  args = Arguments().get_args()

  if (args.docker):
    docker = Docker(name="sonarqube", recreate=args.recreate)
    docker.run()

  sonar = SonarQube(base_url=args.sonar_url, component=args.component, username=args.sonar_user, password=args.sonar_password)

  sonar.analyze()