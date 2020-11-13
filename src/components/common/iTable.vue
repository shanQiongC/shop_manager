
<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    enablePagination: {
      type: Boolean,
      default: true
    },
    layout: {
      type: Array,
      default: () => ["total", "sizes", "prev", "pager", "next", "jumper"]
    },
    perPage: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 10
    },
    loadList: {
      type: Function,
      default: () => Promise.resolve(0)
    }
  },
  data() {
    return {
      pagination: {
        page: 1,
        size: this.perPage
      },
      queryItems: {}
    }
  },
  methods: {
    loadListData() {
      return new Promise((resolve, reject) => {
        try {
          resolve(
            this.loadList({
              pagenum: this.pagination.page,
              pagesize: this.pagination.size,
              query: this.queryItems
            })
          )
        } catch (e) {
          reject(e)
        }
      })
    },
    handleSizeChange(newSize) {
      this.$set(this.pagination, "size", newSize)
      this.loadListData()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.$set(this.pagination, "page", newPage)
      this.loadListData()
    }
  },
  render(h) {
    const columns = this.columns.map((column, index) => {
      if (column.render) {
        return (
          <el-table-column
            key={index}
            prop={column.prop}
            columnKey={column.columnKey || column.prop}
            label={column.label}
            width={column.width}
            scopedSlots={{
              default: scoped => {
                return column.render(h, scoped)
              }
            }}
          ></el-table-column>
        )
      } else {
        return (
          <el-table-column
            key={index}
            prop={column.prop}
            label={column.label}
            width={column.width}
          ></el-table-column>
        )
      }
    })
    console.log(columns)

    const paginationContent = this.enablePagination ? (
      <el-pagination
        layout={this.layout.join(",")}
        page-size={this.pagination.size}
        current-page={this.pagination.page}
        total={this.total}
        page-sizes={[5, 10, 15, 20]}
        hideOnSinglePage={true}
        on={{
          "current-change": this.handleCurrentChange,
          "size-change": this.handleSizeChange
        }}
      ></el-pagination>
    ) : null

    return (
      <div>
        <el-table
          id="table"
          data={this.dataList}
          style="width: 100%"
          border
          stripe
        >
          <el-table-column type="index" label="#"></el-table-column>
          {columns}
        </el-table>
        {paginationContent}
      </div>
    )
  }
}
</script>

