-- IT・ソフトウェア開発プロジェクトマネジメントコース: レッスン14
-- DevOpsとCI/CDパイプライン構築

DO $$
DECLARE
  v_course_id INT;
  v_lesson_id INT;
BEGIN
  -- コースIDを取得
  SELECT id INTO v_course_id FROM courses WHERE slug = 'it-software-pm';

  -- レッスン14を挿入
  INSERT INTO lessons (course_id, slug, title, content, "order", created_at)
  VALUES (
    v_course_id,
    'devops-cicd-pipeline',
    'DevOpsとCI/CDパイプライン構築',
    $CONTENT$# DevOpsとCI/CDパイプライン構築

## 📋 このレッスンで学ぶこと

DevOpsは、開発（Development）と運用（Operations）の壁を取り払い、ソフトウェアデリバリーを高速化・自動化する文化と実践の集合です。本レッスンでは、DevOpsの本質的な考え方から、CI/CDパイプラインの具体的な構築方法、主要ツールの活用まで、実践的な知識を学びます。

---

## 🎯 DevOpsの本質

### DevOpsとは何か

DevOpsは単なるツールや技術ではなく、**文化・実践・ツールの三位一体**です。

#### DevOpsの3つの柱

| 柱 | 内容 | 具体例 |
|---|------|--------|
| **文化（Culture）** | 開発と運用の協業、失敗から学ぶ文化、心理的安全性 | チーム間の壁を取り払う、ブレームレス・ポストモーテム |
| **実践（Practice）** | 継続的インテグレーション、継続的デリバリー、IaC | CI/CD、自動テスト、Infrastructure as Code |
| **ツール（Tool）** | 自動化を支えるツールチェーン | Git、Jenkins、Docker、Kubernetes、Terraform |

### DevOpsがもたらす価値

#### DORA（DevOps Research and Assessment）の4つの主要メトリクス

高パフォーマンスなソフトウェアチームを測定する指標:

1. **デプロイ頻度（Deployment Frequency）**
   - エリート: 1日に複数回
   - ハイ: 週に1回〜月に1回
   - ミディアム: 月に1回〜半年に1回
   - ロー: 半年に1回未満

2. **変更のリードタイム（Lead Time for Changes）**
   - エリート: 1時間未満
   - ハイ: 1日〜1週間
   - ミディアム: 1ヶ月〜6ヶ月
   - ロー: 6ヶ月以上

3. **変更失敗率（Change Failure Rate）**
   - エリート: 0-15%
   - ハイ: 16-30%
   - ミディアム/ロー: 31-45%以上

4. **サービス復旧時間（Time to Restore Service）**
   - エリート: 1時間未満
   - ハイ: 1日未満
   - ミディアム: 1日〜1週間
   - ロー: 1週間以上

---

## 🔄 CI/CD（継続的インテグレーション/継続的デリバリー）

### CI（Continuous Integration）: 継続的インテグレーション

開発者がコードをメインブランチに頻繁にマージし、自動的にビルド・テストを実行するプラクティス。

#### CIの目的

- **統合の問題を早期発見**: マージ地獄（Integration Hell）の回避
- **品質の維持**: 自動テストで回帰バグを防止
- **フィードバックの高速化**: コミット後数分で結果が分かる

#### CIパイプラインの典型的なステップ

```
コミット → トリガー
   ↓
ソースコード取得（Checkout）
   ↓
依存関係インストール（npm install / pip install）
   ↓
静的解析（Lint、フォーマットチェック）
   ↓
ビルド（Compile、Transpile）
   ↓
単体テスト（Unit Test）
   ↓
結合テスト（Integration Test）
   ↓
カバレッジレポート生成
   ↓
成果物の保存（Artifact）
   ↓
通知（成功/失敗をSlackやメールで通知）
```

### CD（Continuous Delivery/Deployment）: 継続的デリバリー/デプロイ

#### Continuous Delivery（継続的デリバリー）

本番環境へのデプロイを**いつでも実行できる状態**に保つプラクティス。最終的なデプロイは手動承認。

#### Continuous Deployment（継続的デプロイ）

テストをパスしたコードを**自動的に本番環境にデプロイ**するプラクティス。人間の承認なしで本番リリース。

#### CDパイプラインの典型的なステップ

```
CIパイプライン成功
   ↓
コンテナイメージ作成（Docker Build）
   ↓
イメージレジストリへプッシュ（Docker Hub / ECR / GCR）
   ↓
【ステージング環境へデプロイ】
   ↓
E2Eテスト（End-to-End Test）
   ↓
パフォーマンステスト（Load Test）
   ↓
セキュリティスキャン（Vulnerability Scan）
   ↓
【本番環境へデプロイ】（手動承認 or 自動）
   ↓
スモークテスト（本番環境で基本動作確認）
   ↓
モニタリング・アラート監視
```

---

## 🛠️ CI/CDツールの選択

### 主要なCI/CDツール比較

| ツール | タイプ | 特徴 | 適用場面 |
|-------|--------|------|---------|
| **GitHub Actions** | クラウド | GitHub統合、YAMLで定義、無料枠あり | GitHub利用プロジェクト |
| **GitLab CI/CD** | クラウド/オンプレ | GitLabと完全統合、Auto DevOps | GitLab利用、フルスタック |
| **Jenkins** | オンプレ/クラウド | 高カスタマイズ性、豊富なプラグイン | 複雑な要件、オンプレ環境 |
| **CircleCI** | クラウド | 高速、並列実行に強い | スピード重視 |
| **AWS CodePipeline** | クラウド(AWS) | AWSサービス統合 | AWSエコシステム |
| **Azure Pipelines** | クラウド(Azure) | Azureサービス統合、Windows/.NET強い | Microsoftスタック |

### ツール選定の観点

1. **既存の開発環境**: GitHubを使っているならGitHub Actions、GitLabならGitLab CI/CD
2. **コスト**: パブリックリポジトリなら多くが無料、プライベートは実行時間で課金
3. **カスタマイズ性**: 複雑なパイプラインならJenkins、シンプルならGitHub Actions
4. **クラウドvsオンプレ**: セキュリティ要件でオンプレ必須ならJenkins/GitLab CE
5. **チームのスキル**: 学習コストと運用コストのバランス

---

## 💻 CI/CDパイプラインの実装例

### GitHub Actionsの例

#### 基本的なNode.jsアプリのCI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/coverage-final.json
```

#### Docker イメージビルドとデプロイ

```yaml
# .github/workflows/cd.yml
name: CD

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-1

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Build, tag, and push image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: my-app
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

    - name: Deploy to ECS
      run: |
        aws ecs update-service --cluster my-cluster --service my-service --force-new-deployment
```

---

## 🏗️ Infrastructure as Code（IaC）

### IaCの価値

| 従来の手動構築 | IaCのアプローチ | メリット |
|--------------|----------------|---------|
| 手順書を見ながら手作業 | コードで定義・自動実行 | 再現性、速度 |
| 環境ごとに微妙な差異 | 同じコードで同じ環境 | 一貫性 |
| 変更履歴が不明確 | Gitで変更履歴管理 | 監査性、ロールバック |
| 属人化しやすい | コードレビュー可能 | 知識共有 |

### 主要なIaCツール

#### Terraform

**特徴**: マルチクラウド対応、宣言的、状態管理

```hcl
# main.tf
provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c3fd0f5d33134a76"
  instance_type = "t3.micro"

  tags = {
    Name = "WebServer"
    Environment = "Production"
  }
}

resource "aws_security_group" "web_sg" {
  name        = "web-sg"
  description = "Security group for web server"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**実行コマンド**:
```bash
terraform init      # 初期化
terraform plan      # 実行計画の確認
terraform apply     # 適用
terraform destroy   # 削除
```

#### AWS CloudFormation

**特徴**: AWS専用、AWSサービスと完全統合

```yaml
# template.yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Web Server Stack'

Resources:
  WebServerInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c3fd0f5d33134a76
      InstanceType: t3.micro
      SecurityGroups:
        - !Ref WebSecurityGroup
      Tags:
        - Key: Name
          Value: WebServer

  WebSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for web server
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
```

---

## 🐳 コンテナとオーケストレーション

### Docker: コンテナ化の基本

#### Dockerfileの例

```dockerfile
# Multi-stage build for Node.js app
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]
```

**ベストプラクティス**:
- **マルチステージビルド**: イメージサイズを削減
- **軽量ベースイメージ**: alpine を使用
- **.dockerignore**: 不要なファイルを除外
- **レイヤーの最適化**: 変更頻度の低いコマンドを先に配置

### Kubernetes: コンテナオーケストレーション

#### Kubernetesの基本概念

| リソース | 説明 | 用途 |
|---------|------|------|
| **Pod** | 1つ以上のコンテナのグループ | 最小デプロイ単位 |
| **Deployment** | Podの宣言的管理 | アプリのデプロイ、スケーリング |
| **Service** | Podへのネットワークアクセス | ロードバランシング、サービスディスカバリ |
| **Ingress** | 外部からのHTTP/HTTPSアクセス | ルーティング、SSL終端 |
| **ConfigMap** | 設定情報 | 環境変数、設定ファイル |
| **Secret** | 機密情報 | パスワード、APIキー |

#### デプロイメント例

```yaml
# deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: myregistry/web-app:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: db-host
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## 📊 モニタリングとオブザーバビリティ

### オブザーバビリティの3本柱

1. **メトリクス（Metrics）**: 数値データ（CPU使用率、レスポンス時間、エラー率）
2. **ログ（Logs）**: イベントの記録（アクセスログ、エラーログ）
3. **トレース（Traces）**: 分散システムでのリクエストの流れ

### モニタリングツール

| ツール | 種類 | 特徴 |
|-------|------|------|
| **Prometheus + Grafana** | メトリクス | オープンソース、Kubernetes親和性高い |
| **ELK Stack** | ログ | Elasticsearch + Logstash + Kibana |
| **Datadog** | 統合 | SaaS、メトリクス・ログ・トレース統合 |
| **New Relic** | APM | アプリケーションパフォーマンス監視 |
| **Jaeger / Zipkin** | トレース | 分散トレーシング |

### SLI/SLO/SLA

| 用語 | 意味 | 例 |
|-----|------|---|
| **SLI** (Service Level Indicator) | サービスレベル指標 | 可用性、レイテンシ、エラー率 |
| **SLO** (Service Level Objective) | サービスレベル目標 | 可用性99.9%、P99レイテンシ200ms以下 |
| **SLA** (Service Level Agreement) | サービスレベル契約 | SLO未達時の補償条件 |

**エラーバジェット**: SLOで許容される障害時間

```
可用性SLO 99.9% の場合
→ エラーバジェット = 0.1% = 月間約43分のダウンタイム許容

エラーバジェットの使い方:
- 余裕がある → 新機能リリース加速
- 消費が多い → 安定性重視、リリース減速
```

---

## 🚀 デプロイ戦略

### 主要なデプロイ戦略の比較

| 戦略 | 説明 | メリット | デメリット | リスク |
|-----|------|---------|----------|--------|
| **ローリングデプロイ** | 段階的に新バージョンに置き換え | ダウンタイムなし、ロールバック容易 | 両バージョン混在期間 | 中 |
| **ブルーグリーンデプロイ** | 新環境（グリーン）を用意し、切替 | 即座に切替、簡単ロールバック | リソース2倍必要 | 低 |
| **カナリアデプロイ** | 一部ユーザーのみ新バージョン | 本番で段階的検証 | 複雑、監視必須 | 低 |
| **フィーチャーフラグ** | コード内でフラグで機能ON/OFF | デプロイとリリース分離 | コードが複雑化 | 最低 |

### カナリアデプロイの例

```
ステップ1: 新バージョンを5%のトラフィックに適用
   ↓ メトリクス監視（エラー率、レイテンシ）
ステップ2: 問題なければ25%に拡大
   ↓ さらに監視
ステップ3: 50%に拡大
   ↓
ステップ4: 100%に拡大（完全移行）

※ 問題検知時は即座にロールバック
```

---

## ⚠️ よくある課題と対策

### 課題1: テストが遅く、CI/CDのボトルネックになる

**対策**:
- **並列実行**: テストを分割して並列実行
- **テストピラミッド**: E2Eテストは最小限、単体テストを充実
- **選択的テスト**: 変更箇所に関連するテストのみ実行
- **キャッシュ活用**: 依存関係のキャッシュ

### 課題2: 本番環境でしか再現しない障害

**対策**:
- **環境の同一性**: IaCで開発・ステージング・本番を同じ構成に
- **カナリアデプロイ**: 段階的リリースで早期検出
- **オブザーバビリティ**: ログ・メトリクス・トレースで原因特定
- **カオスエンジニアリング**: 意図的に障害を起こして耐性を確認

### 課題3: デプロイ後のロールバックが困難

**対策**:
- **データベースマイグレーション**: 前方互換性のある変更
- **ブルーグリーンデプロイ**: 旧環境を残しておく
- **自動ロールバック**: メトリクス監視で自動的にロールバック
- **フィーチャーフラグ**: デプロイせずに機能を無効化

---

## 🎓 まとめ

DevOpsとCI/CDは、ソフトウェアデリバリーの**スピード・品質・信頼性**を同時に向上させる強力なアプローチです。

### DevOps成功の5つのポイント

1. **文化の変革**: 開発と運用の協業、失敗から学ぶ姿勢
2. **自動化の徹底**: CI/CD、IaC、テスト自動化
3. **小さく頻繁にリリース**: リスクを小さく、フィードバックを早く
4. **モニタリングとフィードバック**: データドリブンな改善
5. **継続的改善**: DORAメトリクスで測定し、常に改善

DevOpsは一度導入すれば終わりではなく、継続的な改善のサイクルです。小さく始めて、段階的に成熟度を高めていきましょう。
$CONTENT$,
    14,
    NOW()
  ) RETURNING id INTO v_lesson_id;

  -- レッスン14の質問を挿入
  INSERT INTO questions (lesson_id, type, question, options, correct_answer, explanation, "order", created_at)
  VALUES
    -- 質問1: DevOpsの本質理解
    (v_lesson_id, 'multiple-choice', 'DevOpsを導入する際、最も重要な第一歩はどれですか？',
     ARRAY['CI/CDツール（Jenkins、GitHub Actions等）を導入し、自動化パイプラインを構築する',
           'DockerとKubernetesを導入し、コンテナ化とオーケストレーションを実現する',
           '開発チームと運用チームの協業文化を醸成し、共通のゴール（デリバリーの高速化と安定性）を設定する',
           'Infrastructure as Code（Terraform等）を導入し、インフラのコード管理を始める'],
     ARRAY['開発チームと運用チームの協業文化を醸成し、共通のゴール（デリバリーの高速化と安定性）を設定する'],
     'A、B、Dはすべて重要な「ツール・実践」ですが、これらは手段です。Cが正解で、DevOpsの本質は「文化」です。ツールを導入しても、開発と運用が対立したままでは効果は限定的です。まず「協業する文化」「共通のゴール」を設定し、その上でツールと実践を導入するのが正しい順序です。"DevOpsはツールではなく文化である"という原則を忘れてはいけません。ツール先行は失敗パターンの典型です。',
     1, NOW()),

    -- 質問2: CI/CD戦略の選択
    (v_lesson_id, 'multiple-choice', 'スタートアップで小規模チーム（5名）、GitHubでコード管理している場合、最適なCI/CDツールはどれですか？',
     ARRAY['Jenkinsを自社サーバーに構築し、高度にカスタマイズされたパイプラインを作成する',
           'GitHub Actionsを使い、YAMLで定義したワークフローで迅速にCI/CDを開始する',
           'AWS CodePipelineを使い、AWSエコシステムと完全統合されたパイプラインを構築する',
           'CircleCIの有料プランを契約し、最高速の並列実行環境を確保する'],
     ARRAY['GitHub Actionsを使い、YAMLで定義したワークフローで迅速にCI/CDを開始する'],
     'Aは小規模チームには過剰で、Jenkins運用のコストが高すぎます（サーバー管理、プラグイン管理）。CのAWS CodePipelineは既にAWSを使っている場合は良いですが、GitHub中心の開発フローとの統合は煩雑です。DのCircleCI有料プランは、スタートアップには初期コストが高く、必要性が不明です。Bが正解で、GitHub ActionsはGitHubとネイティブ統合されており、設定がシンプル（YAMLファイル）で、パブリックリポジトリなら無料、プライベートでも無料枠が大きいです。小規模チームは「シンプルで素早く始められる」ツールを選ぶべきです。',
     2, NOW()),

    -- 質問3: デプロイ戦略の選択
    (v_lesson_id, 'multiple-answer', '本番環境への新バージョンデプロイで、リスクを最小化するために有効な戦略はどれですか？（複数選択）',
     ARRAY['カナリアデプロイで一部ユーザーのみに新バージョンを適用し、メトリクスを監視してから全体展開する',
           'ブルーグリーンデプロイで新環境を用意し、問題があれば即座に旧環境に切り戻せるようにする',
           'すべての変更を1つの大きなリリースにまとめ、月に1回デプロイして変更管理を簡素化する',
           'フィーチャーフラグを使い、コードはデプロイするが機能のON/OFFをコントロール可能にする'],
     ARRAY['カナリアデプロイで一部ユーザーのみに新バージョンを適用し、メトリクスを監視してから全体展開する', 'ブルーグリーンデプロイで新環境を用意し、問題があれば即座に旧環境に切り戻せるようにする', 'フィーチャーフラグを使い、コードはデプロイするが機能のON/OFFをコントロール可能にする'],
     'A、B、Dが正解です。Aのカナリアデプロイは本番環境で段階的に検証でき、リスクを最小化します。Bのブルーグリーンデプロイは即座にロールバック可能で、安全性が高いです。Dのフィーチャーフラグはデプロイとリリースを分離し、問題があればコードを戻さず機能を無効化できます。Cは誤りで、大きなリリースは変更が多くリスクが高く、問題発生時の原因特定も困難です。DevOpsの原則は「小さく頻繁にリリース」であり、リスクを小さくすることです。',
     3, NOW()),

    -- 質問4: Infrastructure as Codeの価値
    (v_lesson_id, 'multiple-choice', 'Infrastructure as Code（IaC）を導入する最大のメリットはどれですか？',
     ARRAY['インフラ構築が自動化され、手作業より圧倒的に速くなる',
           'クラウドコストが削減され、リソースの無駄遣いを防げる',
           'インフラの構成がコードで管理され、再現性・一貫性・変更履歴の追跡が可能になる',
           '最新のクラウド技術（Terraform、CloudFormation）を使うことでエンジニアのスキルアップにつながる'],
     ARRAY['インフラの構成がコードで管理され、再現性・一貫性・変更履歴の追跡が可能になる'],
     'Aの速度向上は副次的メリットです（初回作成は手作業と同等以上の時間がかかることも）。Bのコスト削減はIaCの直接的なメリットではなく、リソース管理の問題です。Dのスキルアップは組織的メリットですが本質ではありません。Cが正解で、IaCの最大の価値は「再現性」「一貫性」「変更履歴管理」です。同じコードで何度でも同じ環境を作れ（再現性）、dev/staging/prodで同じ構成にでき（一貫性）、Gitで変更履歴を追跡しロールバック可能（監査性）です。これにより「インフラのドリフト（構成のズレ）」や「誰が何を変更したか分からない」問題を解決します。',
     4, NOW()),

    -- 質問5: DORAメトリクスの活用
    (v_lesson_id, 'multiple-choice', 'DORAの4つのメトリクス（デプロイ頻度、リードタイム、変更失敗率、復旧時間）を改善する際、最初に取り組むべきはどれですか？',
     ARRAY['デプロイ頻度を上げることで、小さく頻繁にリリースする文化を作り、他のメトリクスも自然に改善する',
           'リードタイムを短縮することで、アイデアから本番リリースまでの時間を最小化し、ビジネス価値を早く届ける',
           '変更失敗率を下げることで、品質を向上させ、安定したデリバリーを実現する',
           'サービス復旧時間を短縮することで、障害時の影響を最小化し、可用性を高める'],
     ARRAY['変更失敗率を下げることで、品質を向上させ、安定したデリバリーを実現する'],
     'A、B、Dは一見合理的ですが、品質（変更失敗率）が高いまま頻度やスピードを上げると、障害が多発し逆効果です。Aのデプロイ頻度を上げても品質が低ければ本番障害が増えます。Bのリードタイム短縮も同様に、品質犠牲では意味がありません。Dの復旧時間短縮は重要ですが、そもそも障害を減らす方が先決です。Cが正解で、まず「品質（変更失敗率）」を改善することで、安心してデプロイ頻度を上げ、リードタイムを短縮できます。DevOpsは「スピードと安定性の両立」が目標であり、安定性なきスピードは持続可能ではありません。品質基盤を整えてから加速するのが正しい順序です。',
     5, NOW());

END $$;
