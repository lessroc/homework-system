<template>
  <List item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
    <template #footer>
      <div>
        <b>ant design vue</b>
        footer part
      </div>
    </template>
    <template #renderItem="{ item }">
      <ListItem key="item.title">
        <template #actions>
          <span v-for="{ type, text } in actions" :key="type">
            <component :is="type" style="margin-right: 8px" />
            {{ text }}
          </span>
        </template>
        <template #extra>
          <img
            width="272"
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          />
        </template>
        <ListItemMeta :description="item.description">
          <template #title>
            <a :href="item.href">{{ item.title }}</a>
          </template>
          <template #avatar><Avatar :src="item.avatar" /></template>
        </ListItemMeta>
        {{ item.content }}
      </ListItem>
    </template>
  </List>
</template>
<script lang="ts" setup>
  import { List, Avatar } from 'ant-design-vue';
  const ListItem = List.Item;
  const ListItemMeta = List.Item.Meta;

  const listData: Record<string, string>[] = [];

  for (let i = 0; i < 23; i++) {
    listData.push({
      href: 'https://www.antdv.com/',
      title: `ant design vue part ${i}`,
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
  }
  const pagination = {
    onChange: (page: number) => {
      console.log(page);
    },
    pageSize: 3,
  };
  const actions: Record<string, string>[] = [
    { type: 'StarOutlined', text: '156' },
    { type: 'LikeOutlined', text: '156' },
    { type: 'MessageOutlined', text: '2' },
  ];
</script>
